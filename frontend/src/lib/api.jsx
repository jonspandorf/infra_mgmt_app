import axios from "axios"

const url = process.env.REACT_APP_API_URL || 'http://10.175.121.95:5001/api'


function getAuthConfig(token,isMultiForm=false) {

    return {
      headers: {
        Authorization: 'Bearer' + token,
        ...(isMultiForm && { "content-type": "multipart/form-data", })
      }
    };
  }


export const getHypervisors = async (token) => {
    try {
        const res = await axios.get(`${url}/resources/vsphere/servers`, getAuthConfig(token))
        return res.data
    } catch (err) {
        return err
    }
}

export const getMainView = async (datacenter,token) => {

    try {
        const data = await axios.get(`${url}/ipam/main/${datacenter}`, getAuthConfig(token))       
        return data
    } catch (err) {
        return err
    }
}

export const getLabs = async (token) => {
    try {
        const data = await axios.get(`${url}/ipam/labs`, getAuthConfig(token))
        return data
    } catch (err) {
        return err
    }
}

export const getLabsInfo = async (token) => {
    
    try {
        const res = await axios.get(`${url}/ipam/labs-info`, getAuthConfig(token))
        return res.data
    } catch (err) {
        return err
    }
}


export const getOwners = async (token) => {

    try {
        const res = await axios.get(`${url}/users/admins`,getAuthConfig(token))
        return res.data
    } catch (err) {
        return err
    }
}

export const getVcenterData = async (vsphere_ip,token) => {
    try {
        const res = await axios.get(`${url}/resources/vsphere/${vsphere_ip}`,getAuthConfig(token))
        return res.data.data
    } catch (err) {
        return err
    }
}

export const getDatacenterTemplates = async (vsphere,datacenter,token) => {
    try {
        const res = await axios.get(`${url}/instances/templates/${vsphere}/${datacenter}`,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const getBaremetalInventory = async (labId,token) => {
    try {
        const res = await axios.get(`${url}/resources/inventory/${labId}`, getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const getBaremetalDeviceDetails = async (deviceId,token) => {
    try {
        const res = await axios.get(`${url}/resources/inventory/devices/${deviceId}`, getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const getBaremetalDeviceRequestedPasswd = async (deviceId,passwordName,token) => {
    try {
        const res = await axios.get(`${url}/resources/inventory/devices/passwords/${deviceId}/${passwordName}`,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}
// POST

export const createNewUser = async (data,token) => {
    try { 
        const res = await axios.post(`${url}/users/new-user`, data,getAuthConfig(token)) 
        return res
    } catch (err) {
        return err
    }
}

//  NON PROTECTED ROUTE

export const loginWithUsernameAndPassword = async (data) => {
    try {
        const res = await axios.post(`${url}/users/login`, data)
        return res
    } catch (err) {
        return  err.response
    }
}

export const addNewDeviceToInventory = async (data,token) => {
    try {
        const res = await axios.post(`${url}/resources/inventory/add-device`,data, getAuthConfig(token))
        return res

    } catch (err) {
        return err.response
    }
}

export const queryForAddresses = async (data,token) => {
    try {
        const res = await axios.get(`${url}/ipam/query-addresses/${data.lab_id}/${data.numOfInstances}`,getAuthConfig(token))
        return res
    
    } catch (err) {
        return err
    }
}

export const initiateLabRange = async (data,token) => {
    try {
        const res = await axios.post(`${url}/ipam/create-range`, data,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const LaunchInstances = async (data,token) => {


    try {
        const res = await axios.post(`${url}/instances/launch-vm`, data ,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const createTemplate = async (data,token) => {


    const location = data.file.size ? 'create-template-from-file' : 'create-template-from-link'
    const isMultiForm = data.file.size ? true : false

    try {
        const res = await axios.post(`${url}/instances/${location}`, data, getAuthConfig(token, isMultiForm))
        return res
    } catch (err) {
        return err
    }
}

export const addTemplateToDB = async (data,token) => {
    try {
        const res = await axios.post(`${url}/instances/templates/`, data,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

export const addNewUser = async (oldata,permissions,token) => {
    const data = { ...oldata, permissions }
    try {
        const res = await axios.post(`${url}/users/add-user/`, data,getAuthConfig(token)) 
        return res
    } catch (err) {
        return err 
    }
}

export const addNewVsphereServer = async (data,token) => {

    try {
        const res = await axios.post(`${url}/resources/vsphere/add-server/`, data,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}

// PUT


export const submitNewAddresses = async (data,token) => {

    try {
        const res = await axios.put(`${url}/ipam/new-addresses`, data,getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}



// DELETE
export const destroyInstances = async (id,data,token) => {
    const auth = getAuthConfig(token)
    try {
        const res = await axios.delete(`${url}/instances/delete/${id}`, { ...auth, data } )
        return res

    } catch (err) {
        return err
    }

}

export const deleteBaremetalDeviceFromDB = async (id,token) => {
    try {
        const res = await axios.delete(`${url}/resources/inventory/devices/delete/${id}`, getAuthConfig(token))
        return res.data
    } catch (err) {
        return err
    }
}

export const deleteAddressRange = async (id,lab,token) => {
    try {
        const res = await axios.delete(`${url}/ipam/delete-range/${lab}/${id}`,getAuthConfig(token))
        return res

    } catch (err) {
        return err
    }
}

export const deleteLabRange = async (labId,token) => {
    try {
        const res = await axios.delete(`${url}/ipam/delete-all-addresses/${labId}`, getAuthConfig(token))
        return res
    } catch (err) {
        return err
    }
}