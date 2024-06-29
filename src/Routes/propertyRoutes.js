const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

router.post("/userProperties", propertyController.getUserProperties);
router.post("/getTrackData", propertyController.getTrackData);
router.post("/createTrackData", propertyController.createTrackData);
router.post("/updateTrackData", propertyController.updateTrackData);
router.post("/postProperty", propertyController.postProperty);
router.post("/getEditedProperty", propertyController.getEditPropertyData);
router.post("/editProperty", propertyController.editPropertyData);
router.get("/getAllProperties", propertyController.getAllActiveProperties);
router.get("/getAllCities", propertyController.getAllCitiesNames);
router.post("/getfilteredProperties", propertyController.getFilteredProperty);

module.exports = router;
