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
    if (!isNullOrUndefined(existingUser)) {
      await collections.userCollection.updateOne(
        { phoneNumber },
        {
          $set: { registeredAs: registeredAs },
        }
      );
      res.send({
        statusCode: 200,
        message: "Login Successful !!",
        response: existingUser,
      });
    } else {
      res.send({
        statusCode: 404,
        message: "Phone Number is not registered. Please signup and try again.",
      });
    }
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, city, state } = req.body;
    const existingUser = await collections.userCollection.findOne({
      phoneNumber,
    });
    if (isNullOrUndefined(existingUser)) {
      const newUser = new userModel({
        name,
        email,
        phoneNumber,
        city,
        state,
        registeredAs: "",
        profileImage: "",
        rating: "",
        experience: "",
        propertyType: "",
        address: "",
        description: "",
      });
      await collections.userCollection.insertOne(newUser);
      res.send({ statusCode: 201, message: "Signup Successful !!" });
    } else {
      res.send({
        statusCode: 403,
        message:
          "You are already registered with this Phone Number. Please login now.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error", err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { city, rating } = req.body;
    var query = {};
    if (city) query.city = city;
    if (rating) query.rating = rating;
    const pageOptions = {
      page: parseInt(req.body.page, 10) || 0,
      limit: parseInt(req.body.limit, 10) || 10,
    };
    const length = await collections.userCollection.countDocuments();
    const allUsers = await collections.userCollection
      .find(query)
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .toArray();
    res.send({ statusCode: 200, total: length, response: allUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.getAllAgentsCities = async (req, res) => {
  try {
    const allCitieNames = await collections.userCollection.distinct("city");
    res.send({ statusCode: 200, response: allCitieNames });
  } catch (err) {
    console.log(err);
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
    const { _id, ...body } = req.body;
    const existingUser = await collections.userCollection.findOne({
      phoneNumber: body.phoneNumber,
    });
    if (!isNullOrUndefined(existingUser)) {
      await collections.userCollection.updateOne(
        { phoneNumber: body.phoneNumber },
        {
          $set: body,
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
