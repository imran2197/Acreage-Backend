const express = require("express");
const collections = require("../index");
const users = require("../models/userModel");
const trackData = require("../models/trackDataModel");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:4200", "https://acreage-properties.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const userModel = users.userModel;
const trackModel = trackData.trackModel;

const isNullOrUndefined = (val) => val === null || val === undefined;

app.get("/", (req, res) => {
  res.send("Server is working fine!!");
});

app.get("/users", async (req, res) => {
  const users = await collections.userCollection.find().toArray();
  res.send(users);
});

app.post("/acreage/login", async (req, res) => {
  const { phoneNumber } = req.body;
  const existingUser = await collections.userCollection.findOne({
    phoneNumber,
  });
  if (isNullOrUndefined(existingUser)) {
    const newUser = new userModel({
      phoneNumber,
    });
    await collections.userCollection.insertOne(newUser);
    res.send({ statusCode: 201, message: "User added successfully." });
  } else {
    res.send({ statusCode: 200, message: "User already exists." });
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

module.exports = app;
