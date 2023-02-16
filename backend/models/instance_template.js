const { Schema, model } = require('mongoose');

const templateSchema = new Schema({

    vcenter_template_name: { type: String, required: true },
    template_name: { type: String, required: true },
    vsphere_host: { type: String, required: true, unique: false },
    datacenter: { type: String, required: true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
    
});

module.exports =  model('Template', templateSchema, 'templates')