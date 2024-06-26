const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: Number,
  email: String,
  registeredAs: String,
});

module.exports.userModel = mongoose.model("User", userSchema);
