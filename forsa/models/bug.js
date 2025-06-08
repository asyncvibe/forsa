const mongoose = require('mongoose');
const BugSchema = new mongoose.Schema({

title:{
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},

},{timestamps: true});

const Bug = mongoose.model('Bug', BugSchema);
module.exports = Bug;