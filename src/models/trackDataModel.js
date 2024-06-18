const { default: mongoose } = require("mongoose");

const trackSchema = new mongoose.Schema({
  phoneNumber: Number,
  type: String,
  propertyType: String,
  space: String,
  spaceType: String,
  city: String,
  locality: String,
  state: String,
  lattitude: Number,
  Longitude: Number,
  bedrooms: Number,
  bathRooms: Number,
  balconies: Number,
  carpetArea: Number,
  totalFloors: Number,
  propertyOnFloor: String,
  parkingType: String,
  furnishingType: String,
  ageOfProperty: String,
  //   images: mongoose.Types,
  expectedPrice: Number,
  registrationCharges: Number,
  bookingAmount: Number,
  description: String,
});

module.exports.trackModel = mongoose.model("trackData", trackSchema);
