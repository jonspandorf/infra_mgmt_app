const bcrypt  = require('bcryptjs')
const User = require('../models/user');
const { validationResult } = require('express-validator');
const CustomError = require('../models/error');
const { generateToken } = require('../middleware/auth');



const onCreateUser = async (req, res, next) => {
    try {
        const {fullname, username , email, password, permissions } = req.body;
        if (!req.body.role) req.body.role = 'user'
        const { role } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) return new CustomError('Please check params', 400)
        const isExist = await User.findOne({ email })
        if (isExist) return new CustomError('User Exists in system', 409)
        const hashed = await bcrypt.hash(password,12)
        const newUser = new User({
            fullname,
            username,
            email, 
            password: hashed,
            role,
            ...(permissions && { permissions }),
        })

        newUser.save()
        return res.status(201).send({ message: 'User has been added successfully' })
           

    } catch (err) {
        return next(err)
    }

}

const onLoginUser = async (req,res,next) => {

    try {
        const { username, password } = req.body 
        const user = await User.findOne({ username })
        if (!user) throw new CustomError('User cannot be found. Please contact admin', 400)
        const compare = await bcrypt.compare(password, user.password)
        if (compare) {
            const token = generateToken(user._id, user.email)
            return res.status(200).send({ userId: user._id, token })
        } else {
            console.log(`Incorrect password for ${username}`)
            throw new CustomError('Wrong email or password', 400)
        }
    } catch (err) {
        return next(err)
    }

}

const getCollectionOwners = async (req,res,next) => {

    try {
        const owners = await User.find().select('fullname department')
        return res
          .status(200)
          .send({ owners })
    } catch (err) {
        res
         .status(500)
         .send({ msg: 'problem with fetching owners' })
    }

}



exports.onCreateUser = onCreateUser
exports.onLoginUser = onLoginUser
exports.getCollectionOwners = getCollectionOwners