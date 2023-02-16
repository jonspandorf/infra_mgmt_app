const { Schema, model } = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const vsphereCredsScehma = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' , required: true },
    vcenter: { type: Schema.Types.ObjectId, ref: 'Vsphere', required: true },
    username: { type: String, required: true },
    password: { type: String, required: true}
})

// userSchema.plugin(mongooseUniqueValidator)

module.exports = model('VsphereCreds', userSchema, 'vspherecreds')
