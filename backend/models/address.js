const { Schema, model } = require('mongoose');


const addressSchema = new Schema({
    lab_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lab',
        required: true 
    },
    ip_address: {
        type: String,
        required: true,
        unique: true
    },
    ip_bin: {
        type: Object,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    isFree: {
        type: Boolean,
        required: true,
        default: true
    }, 
    isHead: {
        type: Boolean,
        required: true,
        default: false
    },
    nextAddress: {
        type: String,
        required: false,
        default: null
    },
    prevAddress: {
        type: String,
        required: false,
        default: null
    },
    instance_ref: {
        type: Schema.Types.ObjectId, 
        ref: 'Instance'
    },
    rangeTotal: {
        type: Number,
        required: () => { return this.isHead }  
    },
    addressOwner: { 
        type: String,
        required: false
    },
});

// const models = {};

// const CreateCollection = (name) => {
//     if (!(name in models)) {

//         models[name] = mongoose.model(name,addressSchema)
//     } 
//     return models[name]

// }

module.exports =  model('Address', addressSchema, 'addresses')
