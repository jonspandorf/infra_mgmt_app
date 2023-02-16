const express = require('express')
const { queryVcenterData, onNewInstance, destroyInstancesCluster, onNewTemplate, getDatacenterTemplates, onExistingTemplate } = require('../controller/instances')
const { checkAuthentication } = require('../middleware/auth')
const { upload } = require('../middleware/file_upload')

const router = express.Router()

//  GET

router.get('/templates/:vsphere_host/:datacenter', checkAuthentication, getDatacenterTemplates)

//  POST

router.post('/launch-vm', checkAuthentication, onNewInstance)

router.post('/create-template-from-link', checkAuthentication,  onNewTemplate)

router.post('/create-template-from-file', checkAuthentication, upload.single('file'), onNewTemplate)

router.post('/templates/',checkAuthentication, onExistingTemplate)

// DELETE

router.delete('/delete/:id',checkAuthentication, destroyInstancesCluster)

module.exports = router
