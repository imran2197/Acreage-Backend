const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const dotenv = require("dotenv");
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

exports.uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${file.originalname}-${Date.now()}`);
    },
  }),
}).array("image", 10);
