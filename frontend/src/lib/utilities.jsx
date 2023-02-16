import { useState } from "react";
import { useEffect } from "react";
import { addNewDeviceToInventory, addTemplateToDB, createNewUser, createTemplate, deleteAddressRange, destroyInstances, getHypervisors, getLabs, getOwners, getVcenterData, initiateLabRange, LaunchInstances, loginWithUsernameAndPassword, submitNewAddresses } from "./api";
import { Button } from "@mui/material";


export const handleChange = (e, values, setValues) => {



    let value;
    if (e.target.files) value = e.target.files[0]
    else if (typeof e.target.value === "boolean") value = !values[e.target.name]
    else if (e.target.name === 'extra_nics') value = !values[e.target.name]
    else value = e.target.value;


    setValues({
        ...values,
        [e.target.name]: value
    })  


}

export const useHypervisors = (token) => {

    const [ hypervisors, setHypervisors ] = useState({})

    useEffect(() => {
        (
            async () => {
                try {
                    if (!token) return
                    const res = await getHypervisors(token)
                    setHypervisors(res) 
                } catch (err) {
                    return err
                }
            }
        )()
    }, [token])

    return hypervisors

}

export const useLabOwners = (token) => {

    const [ owners, setOwners ] = useState([])
    
    useEffect(() => {
        (
            async () => {
                try {
                    if (!token) return 

                    const data = await getOwners(token)
                    setOwners(data.owners.map(owner => ({ id: owner._id, value: owner._id, name: owner.fullname + ' ' + owner.department })))
                } catch (err) {
                    return err
                }
            }
        )()
    }, [token])

    return owners
}

export const useDatacenters = (token) => {

    const [ labs, setLabs ] = useState([])

    
    useEffect(() => {
        (
            async () => {
                try {
                    if (!token) return
                    const res = await getLabs(token)
                    setLabs(res.data.ranges)
                } catch (err) {
                    return err
                }
            }
        )()
    }, [token])
    return labs
}

export const useDcIdx = (dcs,dc) => {

    const [idx, setIdx] = useState(0)

    useEffect(() => {
        if (dc) {
            setIdx(dcs.indexOf(dc))
        }
    }, [dc,dcs])

    return idx

}

export const useVcenters = (vsphere_ip,token) => {

    const [ vsphereData, setVsphereData ] = useState([])

    useEffect(() => {
        (
            async (token) => {
                if (!vsphere_ip || !token) return
                try {
                    const res = await getVcenterData(vsphere_ip,token)
                    setVsphereData(res)
                } catch (err) {
                    return err
                }
            }
        )(token)

    },[vsphere_ip,token])

    return vsphereData

}

export const getVsphereDatacenters = (vcenterData) => {

    if (!vcenterData.length) return []

    const datacenters = vcenterData.map(dc => dc.name)

    return datacenters

}

export const getClustersAndHosts = (vcenterData,idx) => {

    if (!vcenterData.length) return {}
    return { clusters: vcenterData[idx].clusters, esxi_hosts: vcenterData[idx].hosts, useBothTypes: vcenterData[idx].clusters.length? true : false }

}

export const useValues = (initialValues) => {

    const [ values, setValues ] = useState(initialValues)

    return { values, setValues }
}


export const onSubmitInstancesData = async (values,token) => {
    const res = await LaunchInstances(values,token)
    return res
}

export const onSubmitTemplateData = async (values,token) => {
    // TODO
    const res = await createTemplate(values,token)
    return res
}

export const onInitRange = async (values,token) => {
    const res = await initiateLabRange(values,token)
    if (res.status === 200) {
        return { msg: res.data.msg, status: "success" }
    } else {
        return { msg: "Server Fault 500", status: "error" }
    } 

}

export const onNewInventoryDevice = async (values,token)  => {

    const res = await addNewDeviceToInventory(values,token)
    return res
}

export const onGenerateNewAddresses = async (values,token) => {
    const res = await initiateLabRange(values,token)
    return res
}

export const onReserveAddresses = async (values,token) => {
    const res = await submitNewAddresses(values,token)
    return res
}

export const handleReleaseAddressBlock = async (id,lab,token) => {
    const res = await deleteAddressRange(id,lab,token)
    return res
}

export const handleDestroy = async (id,vsphereCreds,token) => {
    const res = await destroyInstances(id,vsphereCreds,token)
    return res
    //handle destruction
}

export const onAddExistingTemplateToDB = async (data,token) => {
    const res = await addTemplateToDB(data,token)
    return res
}

export const isNextButtonDisabled = (condition1, condition2) => {
    if (condition1) {
        if (condition2) return true
    }
    else return false
}

export const handleLogin = async (userData,token,login,navigate) => {

    

    const res = await loginWithUsernameAndPassword(userData,token)
    if (res.status===200) {
        await login(res.data)
        return navigate('/')
    }
    return res
}

export const handleSignup = async (userData,token) => {
    const res = await createNewUser(userData,token)
    return res
}

export const getTableColumns = (initCols,exploreEntry,deleteEntry) => {

    //  TO GENERATE DYNAMICALY from INPUT
    const functionalCols =  [
        {
          field:'details',
          headerName:'Details',
          widht:150,
          renderCell: (cellValues) => {
            return (
              <Button
                variant="contained"
                color="success"
                onClick={(e) => { exploreEntry(e, cellValues.id )}}
              >
                Details
              </Button>
            );
          }
        },
        {
            field:'delete',
            headerName:'Delete Device',
            widht:150,
            renderCell: (cellValues) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => { deleteEntry(e, cellValues.id )}}
                >
                  Delete
                </Button>
              );
            }
        }
      ];
      return [...initCols, ...functionalCols]

}

export const getDevicesTableColumns = (exploreDevice,deleteDevice,editDevice=false) => {

    const columns =  [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'type', headerName: 'Infra Type', width: 130 },
        { field: 'vendor', headerName: 'Vendor', width: 130 },
        { field: 'name', headerName: 'Last name', width: 130 },
        { field: 'role', headerName: 'System', width: 130 },
        { field: 'rack', headerName: 'Rack Nubmer', width: 70 },
        { field: 'management_ip', headerName: 'Operating System Mgmt IP', width: 130 },
        {
          field:'details',
          headerName:'Details',
          widht:150,
          renderCell: (cellValues) => {
            return (
              <Button
                variant="contained"
                color="success"
                onClick={(e) => { exploreDevice(e, cellValues.id )}}
              >
                Details
              </Button>
            );
          }
        },
        // {
        //     field:'edit',
        //     headerName:'Edit',
        //     widht:150,
        //     renderCell: (cellValues) => {
        //       return (
        //         <Button
        //           variant="contained"
        //           color="primary"
        //           onClick={(e) => { editDevice(e, cellValues.id )}}
        //         >
        //           Edit
        //         </Button>
        //       );
        //     }     
        // },
        {
            field:'delete',
            headerName:'Delete Device',
            widht:150,
            renderCell: (cellValues) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => { deleteDevice(e, cellValues.id )}}
                >
                  Delete
                </Button>
              );
            }
        }
      ];

      return columns
      
}

export const initialSignupValues = {
    fullname: '',
    username: '',
    department: '',
    role: 'user',
    email: '',
    password: '',
    confirmPass: ''
}

export const initialInstancesValues = {
    lab: "",
    serverCount: 1,
    alteonCount: 0,
    alteonOVA: null,
    template_type: '',
    template_name: '',
    vm_name: 'radware',
    username: 'radware',
    hostname: 'radware',
    password: '',
    vcpu: 1,
    ram: 1,
    storage: 10,
    ipv4_type: 'dhcp',
    extra_nics: false,
    VSPHERE_HOST: '',
    datastore: 'cisco',
    datacenter: '',
    cluster: '',
    esxi: '',
    static_ips: [],
    dg: '',
    requested_rp: '',
    rp_exists: false,
    VSPHERE_USER: '',
    VSPHERE_PASSWD: '',
}

export const initialTemplateValues = {
    VSPHERE_USER: '',
    VSPHERE_PASSWD: '',
    VSPHERE_HOST: '',
    datacenter: '',
    cluster: '',
    esxi: '',
    ram: 1,
    vcpu: 1,
    storage: 10,
    file: [],
    template_url: ''
}

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const initialHardwareValues  = {
    type: '',
    vendor: '',
    model: '',
    name: '',
    role: '',
    rack: '',
    management_ip: '',
    management_user: '',
    management_password: '',
    remote_access_ip: '',
    remote_access_user: '',
    remote_access_password: '',
    lab: '',
}

export const initialLabRangeValues = {
    cidr: '0.0.0.0/0',
    dg: '',
    startAddress: '1.1.1.1',
    endAddress: '2.2.2.2',
    name: '',
    owner: '',
}