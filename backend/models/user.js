const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: false },
    permissions:[{ type: Array, required: false }],
})


module.exports = model('User', userSchema, 'users')
