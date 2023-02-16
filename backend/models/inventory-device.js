const { Schema, model } = require('mongoose');
const crypto = require('crypto')
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const inventoryDeviceSchema = new Schema({
    type: { type: String, required: true },
    vendor: { type: String, required: true},
    model: { type: String, required: true },
    name: { type: String, reuqired: true },
    role: { type: String, required: false },
    rack: { type: String, required: true },
    management_ip: { type: String, required: false },
    management_user: { type: String, required: false },
    management_password: { type: Object, required: false },
    remote_access_ip: { type: String, required: false },
    remote_access_user: { type: String, required: false },
    remote_access_password: { type: Object, required: false },
    iv: { type: String },
    lab:{ type: Schema.Types.ObjectId, ref: 'Lab', required: true },

});


module.exports =  model('InventoryDevice', inventoryDeviceSchema, 'inventory')