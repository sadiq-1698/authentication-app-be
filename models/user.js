const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String
  },
  phone: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const user = mongoose.model("user", UserSchema);
module.exports = user;
