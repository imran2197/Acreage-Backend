const express = require("express");
const collections = require("../index");
const users = require("../models/userModel");
const trackData = require("../models/trackDataModel");
const app = express();
app.use(express.json());

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

app.post("/login", async (req, res) => {
  const { phoneNumber } = req.body;
  const existingUser = await collections.userCollection.findOne({
    phoneNumber,
  });
  if (isNullOrUndefined(existingUser)) {
    const newUser = new userModel({
      phoneNumber,
    });
    await collections.userCollection.insertOne(newUser);
    res.send({ statusCode: 201, message: "Sign up successful." });
  } else {
    res.send({ statusCode: 201, message: "user already exists." });
  }
});

app.post("/trackData", async (req, res) => {
  const { phoneNumber, ...data } = req.body;
  if (phoneNumber) {
    const existingTrackData = await collections.trackCollection.findOne({
      phoneNumber,
    });
    console.log(existingTrackData, req.headers["phonenumber"]);
    if (isNullOrUndefined(existingTrackData)) {
      const newTrackData = new trackModel(req.body);
      await collections.trackCollection.insertOne(newTrackData);
      res.send({ statusCode: 201, message: "Data added successfully." });
    } else {
      res.send("existingTrackData");
    }
  } else {
    res.send({ statusCode: 401, message: "Please login and try again." });
  }
});

module.exports = app;
