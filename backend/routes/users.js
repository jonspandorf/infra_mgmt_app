const express = require('express')
const { onCreateUser, onLoginUser, getCollectionOwners } = require('../controller/users')
const { checkAuthentication } = require('../middleware/auth')

const router = express.Router()

// GET

router.get('/admins',checkAuthentication, getCollectionOwners)


// POST

router.post('/login', onLoginUser)


router.post('/new-user', onCreateUser)

module.exports = router