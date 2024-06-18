const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: Number,
});

module.exports.userModel = mongoose.model("User", userSchema);
