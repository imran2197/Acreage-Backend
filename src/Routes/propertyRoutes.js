const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const { uploadToS3 } = require("../middlewares/uploadToS3");

router.post("/userProperties", propertyController.getUserProperties);
router.post("/getTrackData", propertyController.getTrackData);
router.post("/createTrackData", propertyController.createTrackData);
router.post("/updateTrackData", propertyController.updateTrackData);
router.post("/postProperty", propertyController.postProperty);
router.post("/uploadImages", uploadToS3, propertyController.uploadImagesToS3);
router.post("/deleteImage", propertyController.deleteImageFromS3);

module.exports = router;
