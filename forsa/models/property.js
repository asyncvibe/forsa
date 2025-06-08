const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({

    title: {
        type: String,
       
    },
    purpose: {
        type: String,
        required: true
    },

    bedRooms: {
        type: String
    },
    bathRooms: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },

    // categoryName: {
    //     type: String,
    //     required: true
    // },
    propertyType: {
        type: String,
        required: true
    },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    price: {
        type: String,
        required: true
    },
    createdBy: {
        type: String

    },
    role: {
        type: String,
        required: true
    },

    area: {
        type: String,
        required: true
    },

    covers: {
        type: Array,
        required: true
    },

    isFeatured: {
        type: String
    },
    subCategoryType:{
        type: String
    },
    isFurnished: {
        type: String
    },
    address:{
        type: String
    },
    featuredDate:{
        
        type: Date
    },
    dueDate: {
        startDate: { type: Date },
        endDate: { type: Date }
    },

    summary: {
        type: String
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    sellerDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

}, { timestamps: true });


const Property = mongoose.model('Property', PropertySchema);
module.exports = Property; 