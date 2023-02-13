// * importing mongoose and schema to define user schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// * defining user schema
const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },

  // image
  // voter id
});

// * creating collection
const user = mongoose.model("users", userSchema);

// * exporting to use
module.exports = user;
