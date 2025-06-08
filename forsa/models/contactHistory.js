const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
senderId:{
    type: String,
    required: true
},
receiverId: {
    type: String,
    required: true
},
contactType: {
    type: String,
    required: true
},

},{timestamps: true});

const ContactHistory = mongoose.model('ContactHistory', ContactSchema);
module.exports = ContactHistory;