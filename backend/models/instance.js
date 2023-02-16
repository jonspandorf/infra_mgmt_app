const { Schema, model } = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');



const instanceSchema = new Schema({
    vsphere_host: { type: String, required: true },
    datacenter: { type: String, required: true},
    ip_address: { type: String, required: true },
    state: { type: String, required: false },
    cluster_head: { type: Boolean, required: true},
    prevInstance: { type:String , required: false},
    nextInstance: { type: String, reuqired: false}, 
    ipam_ref: { type: Schema.Types.ObjectId, ref: 'Address', required: false },
    lab_ref: { type: Schema.Types.ObjectId, ref: 'Lab', required: false },
    owner_ref: { type: Schema.Types.ObjectId, ref: 'User', required: false }

});

module.exports =  model('Instance', instanceSchema, 'instances')


// userSchema.plugin(mongooseUniqueValidator)
