const express = require("express");
const router = express.Router();
const s3BucketController = require("../controllers/s3BucketController");
const multer = require("multer");
const upload = multer();

router.post(
  "/uploadProfileImage",
  upload.single("image"),
  s3BucketController.uploadProfileImage
);
router.post(
  "/uploadImagesToTrackData",
  upload.array("image", 15),
  s3BucketController.uploadImagesToTrackData
);
router.post(
  "/deleteImageFromTrackData",
  s3BucketController.deleteImageFromTrackData
);
router.post(
  "/uploadImagesToPropertyData",
  upload.array("image", 15),
  s3BucketController.uploadImagesToPropertyData
);
router.post(
  "/deleteImageFromPropertyData",
  s3BucketController.deleteImageFromPropertyData
);

module.exports = router;
