const mongoose = require('mongoose');
const AdSchema = new mongoose.Schema({

name:{
    type: String,
    required: true
},
imageUrl: {
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},
link:{
    type: String,
    required: true
}

},{timestamps: true});

const Ad = mongoose.model('Ad', AdSchema);
module.exports = Ad;