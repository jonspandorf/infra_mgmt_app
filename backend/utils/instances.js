const { spawn } = require('node:child_process');
const fs = require('fs')
const fs_promises = require('fs').promises
const Instance  = require('../models/instance');
const { CreateCollection } = require('../models/address')
const { default: mongoose } = require('mongoose');
const https = require('https')
const http = require('http')
const Template = require('../models/instance_template')

const os_scripts_path = process.env.OS_SCRIPTS_PATH || '/home/ipam/scripts/'
const os_artifacts_path = process.env.OS_ARTIFACTS_PATH || '/home/ipam/artifacts'
const LocalArtifacts = '/artifacts'
const os_files_path = process.env.OS_FILES_PATH || '/home/ipam/files'
const local_files_path = process.env.LOCAL_FILES_PATH
const os_tf_path = process.env.OS_TF_PATH || '/home/ipam/terraform'
const local_tf_path = process.env.LOCAL_TF_PATH || '/terraform'

const invokePowershellContainer = async (script, dc,type,arg) => {


    // TODO
      const ps_promise = new Promise((res, rej) => {
        const ps_container =  spawn('docker',['run','--rm','-i','-v' ,`${os_scripts_path}/ps:/scripts`,'-v', `${os_artifacts_path}:/artifacts`,'--entrypoint=/usr/bin/pwsh','vmware/powerclicore',script,'-dc_name',dc,type,arg])
        ps_container.on('close', (code) => {
            if (!parseInt(code)) {
              const raw_ds = fs.readFileSync(`${LocalArtifacts}/ds.json`)
              const ds = JSON.parse(raw_ds)
              fs.unlinkSync(`${LocalArtifacts}/ds.json`)
              res(ds)
            } else {
              console.log('failed to run ps container!')
              rej(false)
            }
        })

      })

    return ps_promise 
}

const spinPowershellContainer = async (script,dsJob=false,args) => {
  console.log('executing ps container!')
  const ps_promise = new Promise((res, rej) => {
    const ps_container =  spawn('docker',['run','--rm','-i','-v' ,`${os_scripts_path}/ps:/scripts`,'-v', `${os_files_path}:/images`, '-v',`${os_artifacts_path}:/artifacts` ,'--entrypoint=/usr/bin/pwsh','vmware/powerclicore',script,...args])
    ps_container.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    ps_container.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })
    ps_container.on('close', (code) => {
        if (!parseInt(code)) {
          let result;
          if  (dsJob) result = readDatastoreInfo()
          else result = true
          res(result)
        } else {
          console.log(`failed to run ps container. exit with code ${code}`)
          rej(false)
        }
    })

    ps_container.on('error', (err) => {
      rej(err)
    })

  })

return ps_promise 
}

const readDatastoreInfo = () => {
  const raw_ds = fs.readFileSync(`${LocalArtifacts}/ds.json`)
  const ds = JSON.parse(raw_ds)
  fs.unlinkSync(`${LocalArtifacts}/ds.json`)
  return ds
}

const findDatacenterTemplates = async (vsphere_host,datacenter) => {
  return await Template.find({ vsphere_host, datacenter }).select('vcenter_template_name template_name')
}

const spinTerraformContainer = async (id, envs, vols,  script, args=[], entrypoint=[]) => {

    const tf_promise = new Promise(async (res,rej) => {

      const tf_container = spawn('docker',['run','--rm','-i', ...envs, ...vols, ...entrypoint, 'berlioz-devops-image',script,...args])


      tf_container.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      tf_container.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      tf_container.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (!parseInt(code)) {
          res(true)
        } else {
          console.log(`failed to run tf container for ${id}`)
          rej(false)
        }
      });

    })
    return tf_promise
}

const deleteTfDependencies = (id) => {
  fs.rmSync(`${local_tf_path}/user_modules/${id}/.terraform`, { recursive: true, force: true })
}

const hashUserPassword = (password) => {
  const hash_promise = new Promise((res,rej) => {
    const hashed = spawn('mkpasswd', ['--method=SHA-512','--rounds=4096', password])
    hashed.stdout.on('data', (pass) => {
      res(pass.toString().trim())
    })
    hashed.stderr.on('error', (err) => {
      console.log(`stderr: ${err}`)
    })

  })
  return hash_promise
}

const addInstanceToDatabase = async (details,_id,lab) => {
  const { vsphere_host, datacenter, addresses,is_static=true } = details


    try {
      const toWrite = []
      let prev;
      for (const [idx,ip] of addresses.entries()) {
        const details = {
          ...(idx === 0 ? { _id} : { _id: mongoose.Types.ObjectId() }),
          vsphere_host, 
          datacenter,
          state: 'RUNNING',
          ip_address: ip.ip_address,
          ...(idx > 0 ? { cluster_head: false } : { cluster_head: true }),  
          ...(idx > 0 && { prevInstance: prev._id }),
          ...(is_static && {ipam_ref: ip._id}),
          lab_ref: lab,
        }
        if (idx < addresses.length && idx > 0) prev['nextInstance'] = details._id; 
        toWrite.push(details)
        prev = details;
      }
      const inserted = await Instance.insertMany(toWrite)
      if (inserted) return (toWrite.map(doc => {return doc._id}))
      else return false
    } catch (err) {
      return err
    }
} 

const addTemplateToDatabase = async (details) => {
  const { vsphere_host, datacenter, template_name, vcenter_template_name , createdBy } = details
  const new_template = new Template({
    vsphere_host, 
    datacenter, 
    template_name, 
    vcenter_template_name, 
    createdBy
  })

  return await new_template.save()
}

const queryDeployedInstances = async (dc) => {
  const res = await Instance.find({ cluster_head: true }).select('ip_address datacenter state vsphere_host')
  return res
}

const findAndDestroyDBClusterInstances = async (id) => {

  const instances_ids = []
  let headIpId;
  while (id) {
    const instance = await Instance.findById(id)
    if (!headIpId) headIpId = instance.ipam_ref
    id = instance.nextInstance 
    instances_ids.push(instance)
  }
  const deleted = await Instance.deleteMany({ _id: { $in: instances_ids}})
  if (deleted) return headIpId
  else return false 
  
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createJson = (props,static_ips,dg,serverCount) => {

  if (!props) return


  const specs = []

  for (let count = 0; count < serverCount; count++) {

    const vm = {}


    Object.keys(props).forEach(key => {
      // validate entries
      if (key === 'vm_name' && serverCount > 1) vm[key] = `${props[key]}_${count+1}`
      else if (key === 'hostname' && serverCount > 1) vm[key] = `${props[key]}${count+1}`
      else if (key === 'ram') vm[key] = props[key] * 1024
      else vm[key] = props[key]

    })

    if (static_ips.length > 0) {
      vm['static_ip'] = static_ips[count].ip_address
      vm["dg"] = dg      
    } else {
      vm['static_ip'] = ""
      vm['dg'] = ""
    }

    specs.push(vm)
  
  } 

  return specs
}

const createEnvVars = (credentials) => {
  const envArgs = []
  let envArg = '';
  for (const key in credentials) {
    if (credentials.hasOwnProperty(key)) {
      envArgs.push('-e')
      envArg = `TF_VAR_${key}=${credentials[key]}`;
      envArgs.push(envArg)
    }
  }
  return envArgs
}

const createDockerVolumes = (volumes) => {
  const dockerVolumes = []
  
  let volumeArg = ''
  for (const volKey in volumes) {
    if (volumes.hasOwnProperty(volKey)) {
      dockerVolumes.push('-v')
      volumeArg = `${volKey}:${volumes[volKey]}`
      dockerVolumes.push(volumeArg)
    }
  }
  return dockerVolumes
}

const createTfData = async (vsphere_data, vm_specs, static_ips,dg, serverCount) => {
  const tf_user_modules = `${local_tf_path}/user_modules`


  if (!fs.existsSync(tf_user_modules)) fs.mkdirSync(tf_user_modules);

  // choose data to create tffile 

  const id = mongoose.Types.ObjectId().toString()

  const vm_tf_json = {
    module: {
      [`setup_${id}`]: 
      {
        source: "/vm_module",
        VCENTER_USER: "${var.VSPHERE_USER}", 
        VCENTER_PASSWD: "${var.VSPHERE_PASSWD}", 
        VCENTER_HOST: "${var.VSPHERE_HOST}", 
        ...vsphere_data 
      }
    },
    ...(!vsphere_data.is_static_ip && 
          { 
            output: 
              { 
                ips: 
                  { 
                    value: "${module."+`setup_${id}.ip_addresses[*]`+"}"
                  }
              } 
          }
      )
  }
  const var_file = {
    variable: {
      VSPHERE_USER: {},
      VSPHERE_PASSWD: {},
      VSPHERE_HOST: {}
    }
  }

  const instance_json = createJson(vm_specs,static_ips,dg,serverCount)
  vm_tf_json.module[`setup_${id}`]["vm_specs"] = instance_json

  const json_module =  vm_tf_json

  const parsed = JSON.stringify(json_module,null,4)
  fs.mkdirSync(`${tf_user_modules}/${id}`);

  fs.writeFileSync(`${tf_user_modules}/${id}/main.tf.json`, parsed)
  fs.writeFileSync(`${tf_user_modules}/${id}/vars.tf.json`, JSON.stringify(var_file,null,4))
  fs.writeFileSync(`${local_tf_path}/.env`, `WORKING_DIR=${id}`)


  return id

}

const deleteTerraformModule = (id) => {
  try {
    fs.rmSync(`${local_tf_path}/user_modules/${id}`, { recursive: true, force: true })
    return true
  } catch (err) {
    return false 
  }
}


const checkIfHttps = (url) => {

  const ishttps_regex = /(@|#)*?(https)/
  return ishttps_regex.test(url)

}

const downloadOvaFromExternalLink = async (url, template_name,filetype) => {
  const download_promise = new Promise((resolve,rej) => {
    https.get(url,(res) => {
      const path = `${local_files_path}/${template_name}.${filetype}`; 
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish',() => {
          filePath.close();
          resolve(path)
      }).on("error", rej)
  })
})
  return download_promise;
}

const downLoadOvaFromInternalNet = async (url, template_name, filetype) => {
  const download_promise = new Promise((resolve,rej) => {
    http.get(url,(res) => {
      const path = `${local_files_path}/${template_name}.${filetype}`; 
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish',() => {
          filePath.close();
          resolve(path)
      }).on("error", rej)
  })
})
  return download_promise;
}

const sleepTime = (ms) => new Promise(res => setTimeout(res, ms)) 

const parseDhcpAddresses = async (id) => {

  await sleep(3000)
  const data = await fs_promises.readFile(`${local_tf_path}/user_modules/${id}/output.json`)
  const outputJson = JSON.parse(data);
  return Object.values(outputJson.ips.value[0]).map(ip => { return { ip_address: ip }})

}


const extractGuestId = (name) => {
    const guest_ids = [
      { ubuntu: "ubuntu64Guest" }
  ]

  const guest_idx = guest_ids.findIndex( guest => { return name.includes(Object.keys(guest)[0]) } )

  return Object.values(guest_ids[guest_idx])[0]

}

exports.invokePowershellContainer = invokePowershellContainer
exports.spinTerraformContainer = spinTerraformContainer
exports.hashUserPassword = hashUserPassword
exports.addInstanceToDatabase = addInstanceToDatabase
exports.queryDeployedInstances = queryDeployedInstances
exports.findAndDestroyDBClusterInstances = findAndDestroyDBClusterInstances
exports.createJson = createJson
exports.createEnvVars = createEnvVars
exports.createDockerVolumes = createDockerVolumes
exports.createTfData = createTfData
exports.deleteTerraformModule = deleteTerraformModule
exports.downloadOvaFromExternalLink = downloadOvaFromExternalLink
exports.checkIfHttps = checkIfHttps
exports.addTemplateToDatabase = addTemplateToDatabase
exports.downLoadOvaFromInternalNet = downLoadOvaFromInternalNet
exports.spinPowershellContainer = spinPowershellContainer
exports.findDatacenterTemplates = findDatacenterTemplates
exports.parseDhcpAddresses = parseDhcpAddresses
exports.extractGuestId = extractGuestId
exports.sleepTime = sleepTime
exports.deleteTfDependencies = deleteTfDependencies