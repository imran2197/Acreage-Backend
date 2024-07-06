const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { ObjectId } = require("mongodb");

const collections = require("../index");
const dotenv = require("dotenv");
dotenv.config();

const region = process.env.AWS_REGION;
const secretName = process.env.SECRET_NAME;

const secretsManagerClient = new SecretsManagerClient({
  region,
});

const getS3Credentials = async () => {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  try {
    const data = await secretsManagerClient.send(command);
    return JSON.parse(data.SecretString);
  } catch (err) {
    console.log("Error retrieving secret:", err);
    throw err;
  }
};

const initializeS3Client = async () => {
  const credentials = await getS3Credentials();
  return new S3Client({
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });
};

const isNullOrUndefined = (val) => val === null || val === undefined;

exports.uploadProfileImage = async (req, res) => {
  console.log("Incoming File>>>>>>>>>>>>>>", req.file);
  const s3 = await initializeS3Client();
  const uploadParams = {
    Bucket: "acreage-images",
    Key: `${req.file.originalname}`,
    Body: req.file.buffer,
  };
  const phoneNumber = Number(req.body.phoneNumber);
  try {
    if (!isNullOrUndefined(phoneNumber)) {
      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);
      const fileUrl = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;
      console.log("Uploaded To S3 File>>>>>>>>", fileUrl);
      const existingProfile = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingProfile)) {
        await collections.userCollection.updateOne(
          { phoneNumber },
          { $set: { profileImage: fileUrl } }
        );
        res.send({
          statusCode: 200,
          message: "Profile added successfully !!",
        });
      } else {
        res.send({
          statusCode: 401,
          message: "User does not exist. Please login and try again.",
        });
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.uploadImagesToTrackData = async (req, res) => {
  const phoneNumber = Number(req.body.phoneNumber);
  const s3 = await initializeS3Client();
  const files = req.files;
  const uploadFile = async (file) => {
    const uploadParams = {
      Bucket: "acreage-images",
      Key: `${file.originalname}`,
      Body: file.buffer,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;
  };
  try {
    const uploadPromises = files.map(uploadFile);
    const fileUrls = await Promise.all(uploadPromises);
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingTrackData = await collections.trackCollection.findOne({
          phoneNumber,
        });
        if (!isNullOrUndefined(existingTrackData)) {
          await fileUrls.map((file) => {
            collections.trackCollection.updateOne(
              { phoneNumber },
              { $push: { images: file } }
            );
          });
          res.send({
            statusCode: 200,
            message: "Trackdata updated successfully.",
          });
        } else {
          res.send({
            statusCode: 404,
            message: "No trackdata found.",
          });
        }
      } else {
        res.send({
          statusCode: 401,
          message: "User does not exist. Please login and try again.",
        });
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.deleteImageFromTrackData = async (req, res) => {
  const { phoneNumber, filename, imageName } = req.body;
  const s3 = await initializeS3Client();
  const bucketName = "acreage-images";
  const key = filename;
  const deleteparams = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    if (!isNullOrUndefined(phoneNumber)) {
      const command = new DeleteObjectCommand(deleteparams);
      await s3.send(command);
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingTrackData = await collections.trackCollection.findOne({
          phoneNumber,
        });
        if (!isNullOrUndefined(existingTrackData)) {
          await collections.trackCollection.updateOne(
            { phoneNumber },
            { $pull: { images: imageName } }
          );
          res.send({
            statusCode: 200,
            message: "Image deleted successfully.",
          });
        } else {
          res.send({
            statusCode: 404,
            message: "No trackdata found.",
          });
        }
      } else {
        res.send({
          statusCode: 401,
          message: "User does not exist. Please login and try again.",
        });
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.uploadImagesToPropertyData = async (req, res) => {
  const phoneNumber = Number(req.body.phoneNumber);
  const s3 = await initializeS3Client();
  const files = req.files;
  const uploadFile = async (file) => {
    const uploadParams = {
      Bucket: "acreage-images",
      Key: `${file.originalname}`,
      Body: file.buffer,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;
  };
  try {
    const uploadPromises = files.map(uploadFile);
    const fileUrls = await Promise.all(uploadPromises);
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUser = await collections.propertyCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingTrackData = await collections.propertyCollection.findOne({
          phoneNumber,
        });
        if (!isNullOrUndefined(existingTrackData)) {
          await fileUrls.map((file) => {
            collections.propertyCollection.updateOne(
              { phoneNumber },
              { $push: { images: file } }
            );
          });
          res.send({
            statusCode: 200,
            message: "Property data updated successfully.",
          });
        } else {
          res.send({
            statusCode: 404,
            message: "No property data found.",
          });
        }
      } else {
        res.send({
          statusCode: 401,
          message: "User does not exist. Please login and try again.",
        });
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.deleteImageFromPropertyData = async (req, res) => {
  const { phoneNumber, filename, imageName, id } = req.body;
  const s3 = await initializeS3Client();
  const bucketName = "acreage-images";
  const key = filename;
  const deleteparams = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    if (!isNullOrUndefined(phoneNumber)) {
      const command = new DeleteObjectCommand(deleteparams);
      await s3.send(command);
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingPropertyData =
          await collections.propertyCollection.findOne({
            phoneNumber,
            _id: ObjectId.createFromHexString(id),
          });
        if (!isNullOrUndefined(existingPropertyData)) {
          await collections.propertyCollection.updateOne(
            { phoneNumber, _id: ObjectId.createFromHexString(id) },
            { $pull: { images: imageName } }
          );
          res.send({
            statusCode: 200,
            message: "Image deleted successfully.",
          });
        } else {
          res.send({
            statusCode: 404,
            message: "No trackdata found.",
          });
        }
      } else {
        res.send({
          statusCode: 401,
          message: "User does not exist. Please login and try again.",
        });
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};
