const express = require('express')
const { addNewVsphereServer, getAllVsphereServers, queryVcenterData, getAllDevicesFromInventory, addNewDeviceToInventory, getDeviceDetailsById, getDevicePasswordText, updateDeviceUserPass, deleteSignleDeviceFromInventory } = require('../controller/resources')
const { checkAuthentication } = require('../middleware/auth')

const router = express.Router()

// GET


router.get('/vsphere/servers', checkAuthentication, getAllVsphereServers)

router.get('/vsphere/:vsphere_ip',checkAuthentication, queryVcenterData)

router.get('/inventory/:lab', checkAuthentication, getAllDevicesFromInventory)

router.get('/inventory/devices/:deviceId',checkAuthentication, getDeviceDetailsById)

router.get('/inventory/devices/passwords/:deviceId/:req_passwd',checkAuthentication, getDevicePasswordText)

// DELETE

router.delete('/inventory/devices/delete/:deviceId',checkAuthentication, deleteSignleDeviceFromInventory)

// POST

router.post('/vsphere/add-server',checkAuthentication, addNewVsphereServer)

router.post('/inventory/add-device', checkAuthentication, addNewDeviceToInventory)


// UPDATE

router.patch('/inventory/devices/update/:id', checkAuthentication, updateDeviceUserPass)

module.exports = router
