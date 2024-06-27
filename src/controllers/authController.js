const User = require("../models/userModel");
const collections = require("../index");
const userModel = User.userModel;

const isNullOrUndefined = (val) => val === null || val === undefined;

exports.login = async (req, res) => {
  try {
    const { phoneNumber, registeredAs } = req.body;
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
      res.send({
        statusCode: 201,
        message: "User created successfully.",
      });
    } else {
      res.send({
        statusCode: 403,
        message: "User already exists.",
      });
    }
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

exports.getUserData = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.saveUserData = async (req, res) => {
  try {
    const { name, email, phoneNumber, registeredAs } = req.body;
    const existingUser = await collections.userCollection.findOne({
      phoneNumber,
    });
    if (!isNullOrUndefined(existingUser)) {
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
        message: "User details updated successfully.",
      });
    } else {
      res.send({
        statusCode: 404,
        message: "User does not exists. Please login and try again",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};
