const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  city: String,
  state: String,
  registeredAs: String,
  profileImage: String,
  rating: String,
  experience: String,
  propertyType: String,
  address: String,
  description: String,
});

module.exports.userModel = mongoose.model("User", userSchema);
