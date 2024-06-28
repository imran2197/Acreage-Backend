// const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
// const collections = require("../index");
// const dotenv = require("dotenv");
// const { ObjectId } = require("mongodb");
// dotenv.config();

// const BUCKET_NAME = process.env.BUCKET_NAME;
// const s3 = new S3Client({
//   credentials: {
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY,
//   },
//   region: process.env.BUCKET_REGION,
// });

// const isNullOrUndefined = (val) => val === null || val === undefined;

// exports.uploadImagesToTrackData = async (req, res) => {
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

// exports.deleteImageFromTrackData = async (req, res) => {
//   try {
//     const { phoneNumber, filename, imageName } = req.body;
//     if (!isNullOrUndefined(phoneNumber)) {
//       await s3.send(
//         new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename })
//       );
//       const existingUser = await collections.userCollection.findOne({
//         phoneNumber,
//       });
//       if (!isNullOrUndefined(existingUser)) {
//         const existingTrackData = await collections.trackCollection.findOne({
//           phoneNumber,
//         });
//         if (!isNullOrUndefined(existingTrackData)) {
//           await collections.trackCollection.updateOne(
//             { phoneNumber },
//             { $pull: { images: imageName } }
//           );
//           res.send({
//             statusCode: 200,
//             message: "Image deleted successfully.",
//           });
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

// exports.uploadImagesToPropertyData = async (req, res) => {
//   try {
//     const phoneNumber = Number(req.body.phoneNumber);
//     const id = req.body.id;
//     if (!isNullOrUndefined(phoneNumber)) {
//       const existingUser = await collections.userCollection.findOne({
//         phoneNumber,
//       });
//       if (!isNullOrUndefined(existingUser)) {
//         const existingPropertyData =
//           await collections.propertyCollection.findOne({
//             phoneNumber,
//             _id: ObjectId.createFromHexString(id),
//           });
//         if (!isNullOrUndefined(existingPropertyData)) {
//           if (req.files.length > 0) {
//             req.files.map(async (file) => {
//               await collections.propertyCollection.updateOne(
//                 { phoneNumber, _id: ObjectId.createFromHexString(id) },
//                 { $push: { images: file.location } }
//               );
//             });
//             res.send({
//               statusCode: 200,
//               message: "Property data updated successfully.",
//             });
//           }
//         } else {
//           res.send({
//             statusCode: 404,
//             message: "No property data found.",
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

// exports.deleteImageFromPropertyData = async (req, res) => {
//   try {
//     const { phoneNumber, filename, imageName, id } = req.body;
//     if (!isNullOrUndefined(phoneNumber)) {
//       await s3.send(
//         new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename })
//       );
//       const existingUser = await collections.userCollection.findOne({
//         phoneNumber,
//       });
//       if (!isNullOrUndefined(existingUser)) {
//         const existingPropertyData =
//           await collections.propertyCollection.findOne({
//             phoneNumber,
//             _id: ObjectId.createFromHexString(id),
//           });
//         if (!isNullOrUndefined(existingPropertyData)) {
//           await collections.propertyCollection.updateOne(
//             { phoneNumber, _id: ObjectId.createFromHexString(id) },
//             { $pull: { images: imageName } }
//           );
//           res.send({
//             statusCode: 200,
//             message: "Image deleted successfully.",
//           });
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
