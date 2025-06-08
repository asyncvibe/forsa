const mongoose = require('mongoose');
const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        requred: true,
    },

    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],

    assignedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: [] }],
},
{
    timestamps: true
});

const List = mongoose.model('List', ListSchema);
module.exports = List;