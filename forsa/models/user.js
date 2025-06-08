const mongoose = require("mongoose");
const ContactHistory = require("./contactHistory");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    deviceToken:{
      type: String,
      default: ""
    },
    authToken:{
      type: String,
      default: ""
    },
    verify: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    userId: {
      type: String
    },
    imageCompany: {
      type: String
    },
    description: {
      type: String
    },
    address: {
      type: String
    },
    role: {
      type: String,
      default: "Customer"
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: "en"
    },
    fav: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    contactHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ContactHistory" }
    ],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    assignedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: [] }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
