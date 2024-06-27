// const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Property = require("../models/propertyDataModel");
const collections = require("../index");
const propertyModel = Property.propertyModel;

// const dotenv = require("dotenv");
// dotenv.config();

// const BUCKET_NAME = process.env.BUCKET_NAME;
// const s3 = new S3Client({
//   credentials: {
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY,
//   },
//   region: process.env.BUCKET_REGION,
// });

const isNullOrUndefined = (val) => val === null || val === undefined;

exports.getUserProperties = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUserProperties = await collections.propertyCollection
        .find({
          phoneNumber,
        })
        .toArray();
      if (!isNullOrUndefined(existingUserProperties)) {
        res.send({ statusCode: 200, response: existingUserProperties });
      } else {
        res.send({
          statusCode: 404,
          message: "No properties found.",
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

exports.getTrackData = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingTrackData = await collections.trackCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingTrackData)) {
        res.send({ statusCode: 200, response: existingTrackData });
      } else {
        res.send({
          statusCode: 404,
          message: "No trackdata found.",
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

exports.createTrackData = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingTrackData = await collections.trackCollection.findOne({
          phoneNumber,
        });
        if (isNullOrUndefined(existingTrackData)) {
          req.body.createdAt = new Date();
          req.body.active = false;
          const newTrackData = new propertyModel(req.body);
          await collections.trackCollection.insertOne(newTrackData);
          res.send({
            statusCode: 201,
            message: "New track data created successfully.",
          });
        } else {
          res.send({
            statusCode: 200,
            message: "Track data already exist.",
          });
        }
      }
    } else {
      res.send({ statusCode: 401, message: "Please login and try again." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.updateTrackData = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    if (!isNullOrUndefined(phoneNumber)) {
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
            {
              $set: req.body,
            }
          );
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

exports.postProperty = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingTrackData = await collections.trackCollection.findOne({
          phoneNumber,
        });
        if (!isNullOrUndefined(existingTrackData)) {
          req.body.createdAt = new Date();
          req.body.active = true;
          const newPropertyData = new propertyModel(req.body);
          await collections.propertyCollection.insertOne(newPropertyData);
          await collections.trackCollection.deleteOne({
            phoneNumber,
          });
          res.send({
            statusCode: 201,
            message: "Property posted successfully.",
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

// exports.uploadImagesToS3 = async (req, res) => {
//   try {
//     const phoneNumber = Number(req.body.phoneNumber);
//     if (!isNullOrUndefined(phoneNumber)) {
//       const existingUser = await collections.userCollection.findOne({
//         phoneNumber,
//       });
//       if (!isNullOrUndefined(existingUser)) {
//         const existingTrackData = await collections.trackCollection.findOne({
//           phoneNumber,
//         });
//         if (!isNullOrUndefined(existingTrackData)) {
//           if (req.files.length > 0) {
//             req.files.map(async (file) => {
//               await collections.trackCollection.updateOne(
//                 { phoneNumber },
//                 { $push: { images: file.location } }
//               );
//             });
//             res.send({
//               statusCode: 200,
//               message: "Trackdata updated successfully.",
//             });
//           }
//         } else {
//           res.send({
//             statusCode: 404,
//             message: "No trackdata found.",
//           });
//         }
//       } else {
//         res.send({
//           statusCode: 401,
//           message: "User does not exist. Please login and try again.",
//         });
//       }
//     } else {
//       res.send({ statusCode: 401, message: "Please login and try again." });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Server Error");
//   }
// };

// exports.deleteImageFromS3 = async (req, res) => {
//   try {
//     const { phoneNumber, filename, imageName } = req.body;
//     try {
//       if (!isNullOrUndefined(phoneNumber)) {
//         await s3.send(
//           new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename })
//         );
//         const existingUser = await collections.userCollection.findOne({
//           phoneNumber,
//         });
//         if (!isNullOrUndefined(existingUser)) {
//           const existingTrackData = await collections.trackCollection.findOne({
//             phoneNumber,
//           });
//           if (!isNullOrUndefined(existingTrackData)) {
//             await collections.trackCollection.updateOne(
//               { phoneNumber },
//               { $pull: { images: imageName } }
//             );
//             res.send({
//               statusCode: 200,
//               message: "Image deleted successfully.",
//             });
//           } else {
//             res.send({
//               statusCode: 404,
//               message: "No trackdata found.",
//             });
//           }
//         } else {
//           res.send({
//             statusCode: 401,
//             message: "User does not exist. Please login and try again.",
//           });
//         }
//       } else {
//         res.send({ statusCode: 401, message: "Please login and try again." });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Server Error");
//   }
// };
