const { Schema, model } = require('mongoose');


const labSchema = new Schema({
    name: { type: String, required: true, unique: true },
    cidr: { type: String, required: true, unique: true },
    dg: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports =  model('Lab', labSchema, 'labs')
