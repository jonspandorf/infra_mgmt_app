const { Schema, model } = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: false },
    permissions:[{ type: Array, required: false }],
})

// userSchema.plugin(mongooseUniqueValidator)

module.exports = model('User', userSchema, 'users')
