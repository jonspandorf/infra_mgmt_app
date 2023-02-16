const { Schema, model } = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const vsphereSchema = new Schema({
    hostname: { type: String, required: true },
    ip_address: { type: String, required: true },
    username: { type: String, required: true},
    password: { type: String },
    iv: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: 'User' }
})


module.exports = model('VsphereServer', vsphereSchema, 'vspheres')
