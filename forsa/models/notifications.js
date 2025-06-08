const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
title: {
    type: String
},
description:{
type: String
},
tokenId:{
    type: String
},
seen: {
    type: Boolean,
    default: false
}

},
{
    timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;