const express = require('express')
const { getMainView, getAvailableLabs, onAssignAddresses, onReleaseAddresses, onCreateNewLabRange, getCollectionOwners, onAddressesForInstance, onAddNewUser, getLabsAndRanges, onDeleteRange } = require('../controller/ipam')
const { checkAuthentication } = require('../middleware/auth')

const router = express.Router()

// GET

router.get('/main/:dc', checkAuthentication, getMainView)

router.get('/labs',checkAuthentication, getAvailableLabs)

router.get('/query-addresses/:lab_id/:numOfInstances',checkAuthentication, onAddressesForInstance)

router.get('/labs-info', checkAuthentication, getLabsAndRanges)

// POST

router.post('/create-range', checkAuthentication, onCreateNewLabRange)


//  PUT

router.put('/new-addresses', checkAuthentication, onAssignAddresses)

// DELETE

router.delete('/delete-range/:lab/:id', checkAuthentication, onReleaseAddresses)

router.delete('/delete-all-addresses/:lab_id', checkAuthentication, onDeleteRange)

module.exports = router
