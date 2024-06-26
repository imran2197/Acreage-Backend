const express = require("express");
const collections = require("../index");
const users = require("../models/userModel");
const trackData = require("../models/trackDataModel");

const dotenv = require("dotenv");
dotenv.config();

// const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://acreage-properties.netlify.app",
      "https://acreage.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// const BUCKET_NAME = process.env.BUCKET_NAME;
// const s3 = new S3Client({
//   credentials: {
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY,
//   },
//   region: process.env.BUCKET_REGION,
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: BUCKET_NAME,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       // cb(null, Date.now().toString())
//       cb(null, `${file.originalname}-${Date.now()}`);
//     },
//   }),
// }).array("image", 10);

const userModel = users.userModel;
const trackModel = trackData.trackModel;

const isNullOrUndefined = (val) => val === null || val === undefined;

app.get("/", (req, res) => {
  res.send("Server is working fine!!");
});

app.post("/acreage/login", async (req, res) => {
  const { name, email, phoneNumber, registeredAs } = req.body;
  const existingUser = await collections.userCollection.findOne({
    phoneNumber,
  });
  if (isNullOrUndefined(existingUser)) {
    const newUser = new userModel({
      name: "",
      email: "",
      phoneNumber: phoneNumber,
      registeredAs: registeredAs,
    });
    await collections.userCollection.insertOne(newUser);
    res.send({ statusCode: 201, message: "User added successfully." });
  } else {
    await collections.userCollection.updateOne(
      { phoneNumber },
      {
        $set: {
          registeredAs: registeredAs,
          name: name ? name : existingUser.name,
          email: email ? email : existingUser.email,
        },
      }
    );
    res.send({
      statusCode: 200,
      response: existingUser,
    });
  }
});

app.post("/acreage/userData", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!isNullOrUndefined(phoneNumber)) {
    const existingUser = await collections.userCollection.findOne({
      phoneNumber: phoneNumber,
    });
    if (!isNullOrUndefined(existingUser)) {
      res.send({ statusCode: 200, response: existingUser });
    } else {
      res.send({
        statusCode: 404,
        message: "No user availabel with this number.",
      });
    }
  } else {
    res.send({ statusCode: 401, message: "Please login and try again." });
  }
});

app.post("/acreage/getUserProperties", async (req, res) => {
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
});

app.post("/acreage/getTrackData", async (req, res) => {
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
});

app.post("/acreage/createTrackData", async (req, res) => {
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
        const newTrackData = new trackModel(req.body);
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
});

app.post("/acreage/updateTrackData", async (req, res) => {
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
});

app.post("/acreage/postProperty", async (req, res) => {
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
        const newPropertyData = new trackModel(req.body);
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
});

// app.post("/acreage/uploadImages", upload, async (req, res) => {
//   const phoneNumber = Number(req.body.phoneNumber);
//   if (!isNullOrUndefined(phoneNumber)) {
//     const existingUser = await collections.userCollection.findOne({
//       phoneNumber,
//     });
//     if (!isNullOrUndefined(existingUser)) {
//       const existingTrackData = await collections.trackCollection.findOne({
//         phoneNumber,
//       });
//       if (!isNullOrUndefined(existingTrackData)) {
//         if (req.files.length > 0) {
//           req.files.map(async (file) => {
//             await collections.trackCollection.updateOne(
//               { phoneNumber },
//               { $push: { images: file.location } }
//             );
//           });
//           res.send({
//             statusCode: 200,
//             message: "Trackdata updated successfully.",
//           });
//         }
//       } else {
//         res.send({
//           statusCode: 404,
//           message: "No trackdata found.",
//         });
//       }
//     } else {
//       res.send({
//         statusCode: 401,
//         message: "User does not exist. Please login and try again.",
//       });
//     }
//   } else {
//     res.send({ statusCode: 401, message: "Please login and try again." });
//   }
// });

// app.post("/acreage/deleteImage", async (req, res) => {
//   const { phoneNumber, filename, imageName } = req.body;
//   try {
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
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = app;
