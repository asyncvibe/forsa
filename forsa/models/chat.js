const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
senderId:{
    type: String,
    required: true
},
receiverId: {
    type: String,
    required: true
},
Message: {
    type: String,
    required: true
},

},{timestamps: true});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;