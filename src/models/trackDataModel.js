const { default: mongoose } = require("mongoose");

const trackSchema = new mongoose.Schema({
  stepperData: [
    {
      label: String,
      active: Boolean,
      completed: Boolean,
      disabled: Boolean,
    },
  ],
  activeStepper: String,
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
  images: mongoose.Schema.Types.Array,
  expectedPrice: Number,
  registrationCharges: Number,
  bookingAmount: Number,
  description: String,
  isSubmitted: Boolean,
});

module.exports.trackModel = mongoose.model("trackData", trackSchema);
