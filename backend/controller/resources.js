const VsphereServer = require('../models/vsphere')
const fs = require('fs')
const { findVsphereHostname, handlePasswordHasing, decryptPassword } = require('../utils/resources')
const InventoryDevice = require('../models/inventory-device')
const CustomError = require('../models/error')
const { spinPowershellContainer } = require('../utils/instances')
// GET

const DockerArtifacts = process.env.DOCKER_ARTIFACTS_PATH || '/home/ipam/artifacts'
const LocalArtifacts = process.env.LOCAL_ARTIFACTS_PATH || '/artifacts'



const getAllVsphereServers = async (req,res,next) => {

    try {
        const vspheres = await VsphereServer.find().select('hostname ip_address')
        return res.status(200).send({ vspheres })

    } catch (err) {
        return next(err)
    }
}

const queryVcenterData = async (req,res,next) => {
    //  read json
    const { vsphere_ip } = req.params
    const vsphere_hostname = await findVsphereHostname(vsphere_ip)
    const raw_vcenter_data = fs.readFileSync(`${LocalArtifacts}/${vsphere_hostname[0].hostname.toLowerCase()}.json`);
    const data = JSON.parse(raw_vcenter_data);

    return res.status(200).send({ data })
}
// POST

const addNewVsphereServer = async (req,res,next) => {

    

    try {
        const password = req.body.password
        const data = handlePasswordHasing(req.body)
        const vsphere_server = new VsphereServer(data)     
        const addedServer =  await vsphere_server.save()
        const args = ['-viserver',vsphere_server.ip_address ,'-servername', vsphere_server.hostname.toLowerCase(),'-username',vsphere_server.username,'-password',password]
        await spinPowershellContainer('/scripts/gather_vsphere_data.ps1',false,args)
       if (addedServer) return res.status(200).send({ message: 'Appliance added Successfully!'})
    } catch (err) {
        return next(err)
    }
    
}

const addNewDeviceToInventory = async (req,res,next) => {
    
    try {
        const data = handlePasswordHasing(req.body)
        const device = new InventoryDevice(data)
        const saved = await device.save()
        if (saved) return res.status(200).send({ message: 'Successfully added!'})
        else new CustomError('Failed to add device', 500)
    } catch (err) {
        return next(err)
    }
}

const getDeviceDetailsById = async (req,res,next) => {
    const { deviceId } = req.params 

    try {
        const device = await InventoryDevice.findById(deviceId).select(
            'type vendor name role rack management_ip remote_access_ip model lab management_user remote_access_user'
        )
        if (!device) throw new CustomError('Not able to retrieve device details', 400)
        return res.status(200).send({ device })
    } catch (err) {
        return next(err)
    }
}

const getDevicePasswordText = async (req,res,next) => {


    const { deviceId,req_passwd } = req.params



      try {
        const server = await InventoryDevice.findById(deviceId)

        if (!server) new CustomError('Cannot locate requeted host', 404)
        const password = decryptPassword(server,req_passwd)
        return res.status(200).send({ password })
      } catch (err) {
        return next(err)
      }

}

const deleteSignleDeviceFromInventory = async (req,res,next) => {
    const { deviceId } = req.params 

    try {
        const device = await InventoryDevice.findById(deviceId)
        if (!device) throw new CustomError('Device was not found!', 404)
        const deleted = await InventoryDevice.findByIdAndDelete(deviceId)
        if (deleted) return res.status(200).send({ message: 'Device was deleted successfully!' })
        else throw new CustomError('Error. Please try again', 500) 
    } catch (err) {
        return next(err)
    }

}

const getAllDevicesFromInventory = async (req,res,next) => {

    const { lab } = req.params

    try {
        const devices = await InventoryDevice.find({ lab }).select(
            'type vendor name role rack management_ip'   
        )
        return res.status(200).send({ devices })

    } catch (err) {
        next(err)
    }
}

const updateDeviceUserPass = async (req,res,next) => {

    const { id, username, password } = req.body
    let updateUser = username ? true : false

    try {
        let data;
        if (password) data = handlePasswordHasing(req.body)
        const filter = { _id: id }
        const update = {
            ...(data && { [password]: data, iv: data.iv }),
            ...(updateUser && { [username]: username })
        }
        const updated = await InventoryDevice.findOneAndUpdate(filter, update)
        if (updated) return res.status(204).send({ message: 'Device updated successfully!' })
        else throw new CustomError('Could not locate the device',404)
    } catch (err) {
        return next(err)
    }

}

exports.addNewVsphereServer = addNewVsphereServer
exports.getAllVsphereServers = getAllVsphereServers
exports.queryVcenterData = queryVcenterData
exports.getAllDevicesFromInventory = getAllDevicesFromInventory
exports.addNewDeviceToInventory = addNewDeviceToInventory
exports.getDevicePasswordText = getDevicePasswordText
exports.getDeviceDetailsById = getDeviceDetailsById
exports.updateDeviceUserPass = updateDeviceUserPass
exports.deleteSignleDeviceFromInventory = deleteSignleDeviceFromInventory