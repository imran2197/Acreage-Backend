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

module.exports = router;
