const fs = require('fs');
const fs_promises = require('fs/promises')
const { CreateCollection } = require('../models/address');
const CustomError = require('../models/error')
const { addInstanceToDatabase, hashUserPassword, invokePowershellContainer, spinTerraformContainer, queryDeployedInstances, findAndDestroyDBClusterInstances, deleteTerraformModule, downloadOvaFromExternalLink, checkIfHttps, downLoadOvaFromInternalNet, spinPowershellContainer, addTemplateToDatabase, findDatacenterTemplates, parseDhcpAddresses, extractGuestId, sleepTime, deleteTfDependencies, createDockerVolumes, createEnvVars } = require('../utils/instances');
const {  assignInstanceAddresses, findAddressClusterById, updateDbClearedAddresses, clearAddress } = require('../utils/utilities');
const { createEnvFile, createTfData } = require('../utils/instances')
const Instance = require('../models/instance')
const Template = require('../models/instance_template');
const { powershell_args } = require('../utils/misc');
const User = require('../models/user');
const { os_tf_path, os_files_path } = require('../utils/paths');

// GET
const local_tf_path = process.env.LOCAL_TF_PATH || '/terraform'



const getAllDeployedInstances = async (req,res,next) => {

    try {
        const ranges = await getAllRanges()
        const instances = await queryDeployedInstances(ranges)
        res.status(200).send({ instances })
    } catch (err) {
        return next(err)
    } 
}

const getDatacenterTemplates = async (req,res,next) => {
    const { vsphere_host, datacenter } = req.params
    try {
        const templates = await findDatacenterTemplates(vsphere_host,datacenter)
        return res.status(200).send({ templates })
    } catch (err) {
        return next(err)
    }
}

// DELETE

const destroyInstancesCluster = async (req,res,next) => {

    const { VSPHERE_HOST, VSPHERE_PASSWD, VSPHERE_USER } = req.body
    const { id } = req.params

    console.log(`Destroying instance ${id} for ${req.user.userId}`)

    const vsphere_auth = { VSPHERE_HOST, VSPHERE_PASSWD, VSPHERE_USER }

    const template_type = 'ova'

    try {
        await fs_promises.writeFile(`${local_tf_path}/.env`, `WORKING_DIR=${id}`)
        const envArgs = createEnvVars(vsphere_auth)
        const volumes = createDockerVolumes({ 
            [`${os_tf_path}/user_modules/${id}`]: '/app', 
            [`${os_tf_path}/launch_linux_${template_type}`]: '/vm_module', 
            [os_files_path]: '/files'  
        })

        let containerDestroyed = await spinTerraformContainer(id, envArgs, volumes, '-chdir=/app',['init'])
        if (containerDestroyed) containerDestroyed =  await spinTerraformContainer(id, envArgs, volumes, '-chdir=/app',['destroy','-auto-approve'])
        else throw new CustomError('Not able to install tf dependencies, please contact admin', 500)
        if (containerDestroyed) {
            const deleted = deleteTerraformModule(id)
            if (!deleted) throw new CustomError('Please contact administrator to delete instance from db', 500)
            const headIpRef = await findAndDestroyDBClusterInstances(id)
            if (!headIpRef) return res.status(200).send({message: 'destroyed!'})
            const ips = await findAddressClusterById(headIpRef._id)
            const toBeCleared = clearAddress(ips) 
            const cleared = await updateDbClearedAddresses(toBeCleared, Model)
            if (cleared) return res.status(200).send({message: 'destroyed!'})
        }

    } catch (err) {
        return next(err)
    }

}


// POST 
const onNewInstance = async (req,res,next) => {

    console.log(`Deploying Instance for ${req.user.userId}`)

    const { 
        serverCount, 
        VSPHERE_HOST, 
        VSPHERE_PASSWD, 
        VSPHERE_USER, 
        datacenter, 
        esxi, 
        cluster, 
        template_name,
        requested_rp,
        vm_name, 
        vcpu, 
        ram, 
        storage, 
        username, 
        hostname, 
        static_ips, 
        dg, 
        template_type,
        ipv4_type, 
        rp_exists,
        lab 
    } = req.body 


    let { password } = req.body

    let is_static_ip = false 

    if (ipv4_type !== 'dhcp') is_static_ip = true


    password = await hashUserPassword(password)


    const esx_or_cluster = cluster ? `${cluster}` : `${esxi}` 
    const type = cluster ? '-cluster_name' : '-esxi_name'
    const rp = rp_exists === 'on' ? requested_rp : ""
    try {
        console.log(`Acquiring Datastore for deployment`)
        const datastore = await invokePowershellContainer(`/scripts/get_ds.ps1`,datacenter,type,esx_or_cluster,rp)
        
        const vsphere_env_data = { 
            vcenter_datacenter: datacenter, 
            datastore: datastore.Name, 
            requested_rp, 
            is_static_ip: static_ips.length ? true : false, 
            is_on_cluster: cluster ? true : false, 
            bind_to_host: esxi ? true : false,  
            ...(template_type==='template' && { template_name }),
            ...(cluster && { cluster }),
            ...(esxi && { req_host: esxi})
        }

        let guest_id
        if (template_type === 'ova') {
            guest_id = 'ubuntu64Guest'
        }

        const vm_specs = {
            vm_name, 
            vcpu, 
            ram, 
            storage, 
            username,
            hostname, 
            password,
            ...(template_type === 'ova' && { guest_id })
        }

        const vsphere_auth = {
            VSPHERE_USER, 
            VSPHERE_PASSWD, 
            VSPHERE_HOST
        }
    
    
        const tf_id = await createTfData(vsphere_env_data, vm_specs,static_ips, dg, parseInt(serverCount))
        const volumes = createDockerVolumes({ 
            [`${os_tf_path}/user_modules/${tf_id}`]: '/app', 
            [`${os_tf_path}/launch_linux_${template_type}`]: '/vm_module', 
            ...(template_type==='ova' && { [os_files_path]: '/files' }) 
        })

        const envArgs = createEnvVars(vsphere_auth)
        let success;
        success = await spinTerraformContainer(tf_id, envArgs, volumes, '-chdir=/app',['init'])

        if (success) {
            success = await spinTerraformContainer(tf_id, envArgs, volumes, '-chdir=/app',['apply','-auto-approve'])
        } else {
            console.log(`failed to install tf modules for ${req.user.userId}. tf id ${tf_id}`)
            throw new CustomError('Failed to install tf modules', 500)
        }
        if (success && ipv4_type === 'dhcp') {
            success = await spinTerraformContainer(tf_id, envArgs, volumes, '-c' ,['terraform -chdir=/app output -json > /app/output.json'], ['--entrypoint', '/bin/sh'])
        } else {
            console.log(`failed to deploy tf modules for ${req.user.userId}. tf id ${tf_id}`)
            throw new CustomError('Failed to install tf modules', 500)
        }
        if (success) {
            deleteTfDependencies(tf_id)
            let dhcp_ips;
            if (!is_static_ip) {
                dhcp_ips = await parseDhcpAddresses(tf_id)
            } 
            const addresses = is_static_ip ? static_ips : dhcp_ips
            const db_data_pck = { vsphere_host: VSPHERE_HOST, datacenter, addresses, lab }     
            const createdInstancesIds = await addInstanceToDatabase(db_data_pck,tf_id,lab)
            if (createdInstancesIds.length) {
                const assigned = is_static_ip ? await assignInstanceAddresses(lab,addresses.map(ip => ip.ip_address),createdInstancesIds,req.user.userId) : true
                if (assigned) 
                return res
                        .status(200)
                        .send({ message: 'Deployed!' })
            } else {
                await spinTerraformContainer(tf_id, envArgs, volumes, '-chdir=/app',['destroy','-auto-approve'])
                deleteTfDependencies(tf_id)
               return res
                        .status(500)
                        .send({ message: "There was an issue with the creation of the instance. Please try again!"})
            } 
        } else {
            console.log(`deploy failed for ${req.user.userId}. Check user module ${tf_id}`)
        }

    } catch (err) {
        console.error(`recieved error for deployment`, err)
        return next(err)
    }

}

const onNewTemplate = async (req,res,next) => {


    const {
        VSPHERE_HOST,
        VSPHERE_PASSWD,
        VSPHERE_USER,
        vcenter_template_name,
        template_name,
        template_url,
        datacenter,
        cluster,
        esxi,
    } = req.body




    let filename;


    // Add more options future
    let filetype = 'ova'

    try {
        if (!req.file.size && !template_url) return res.status(400).send({ message: 'Please attach a file or a url link' })

        if (req.file.size && template_url) return res.status(400).send({ message: 'Please choose either file or link'})
    
        
        if (template_url) {
            const isExternal = checkIfHttps(template_url)
            if (isExternal) path = await downloadOvaFromExternalLink(template_url,vcenter_template_name,filetype)
            else filename = await downLoadOvaFromInternalNet(template_url,vcenter_template_name,filetype)
        } else {
            filename = req.file.originalname
        }

        

        const powershell_args = [
            '-viserver',
            `${VSPHERE_HOST}`,
            '-username',
            `${VSPHERE_USER}`,
            '-password',
            `${VSPHERE_PASSWD}`,
            '-dc_name',
            `${datacenter}`,
            '-cluster_name',
            `${cluster}`,
            '-esxi_name',
            `${esxi}`,
            '-ovf_path',
            `/images/${filename}`,
            '-template_name',
            `${vcenter_template_name}`
        ]
        
        const created = await spinPowershellContainer('/scripts/deploy_template.ps1',false,powershell_args)
        console.log(created)
        if (created) {
            const data = { vsphere_host: VSPHERE_HOST, datacenter, template_name, vcenter_template_name  }
            const new_template = addTemplateToDatabase(data)
            if (new_template) return res.status(200).send({message: 'Template was added succssefully!'})
        } else {
            return res.status(400).send({ message: 'problem with deployment' })
        }

    } catch (err) {
        return next(err)
    }

}

const onExistingTemplate = async (req,res,next) => {
    const {
        VSPHERE_HOST,
        datacenter,
        template_name,
        vcenter_template_name
    } = req.body

    try {
        const data = { vsphere_host: VSPHERE_HOST, datacenter, template_name, vcenter_template_name  }
        const new_template = await addTemplateToDatabase(data)
        if (new_template) return res.status(200).send({message: 'Template was added succssefully!'})
    } catch (err) {
        console.log(err)
        return next(err)
    }

}

exports.onNewInstance = onNewInstance
exports.getAllDeployedInstances = getAllDeployedInstances
exports.destroyInstancesCluster = destroyInstancesCluster
exports.onNewTemplate = onNewTemplate
exports.getDatacenterTemplates = getDatacenterTemplates
exports.onExistingTemplate = onExistingTemplate