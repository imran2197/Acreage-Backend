const Property = require("../models/propertyDataModel");
const collections = require("../index");
const { ObjectId } = require("mongodb");
const propertyModel = Property.propertyModel;

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

exports.getEditPropertyData = async (req, res) => {
  try {
    const { phoneNumber, id } = req.body;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingPropertyData = await collections.propertyCollection.findOne(
        {
          phoneNumber,
          _id: ObjectId.createFromHexString(id),
        }
      );
      if (!isNullOrUndefined(existingPropertyData)) {
        res.send({ statusCode: 200, response: existingPropertyData });
      } else {
        res.send({
          statusCode: 404,
          message: "No property data found.",
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

exports.editPropertyData = async (req, res) => {
  try {
    const { phoneNumber, _id, ...data } = req.body;
    if (!isNullOrUndefined(phoneNumber)) {
      const existingUser = await collections.userCollection.findOne({
        phoneNumber,
      });
      if (!isNullOrUndefined(existingUser)) {
        const existingPropertyData =
          await collections.propertyCollection.findOne({
            phoneNumber,
            _id: ObjectId.createFromHexString(_id),
          });
        if (!isNullOrUndefined(existingPropertyData)) {
          await collections.propertyCollection.updateOne(
            { phoneNumber, _id: ObjectId.createFromHexString(_id) },
            {
              $set: data,
            }
          );
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

exports.getAllActiveProperties = async (req, res) => {
  try {
    const allActiveProperties = await collections.propertyCollection
      .find({
        active: true,
      })
      .project({ _id: 0, phoneNumber: 0, stepperData: 0 })
      .toArray();
    res.send({ statusCode: 200, response: allActiveProperties });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.getAllCitiesNames = async (req, res) => {
  try {
    const allCitieNames = await collections.propertyCollection.distinct("city");
    res.send({ statusCode: 200, response: allCitieNames });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

exports.getFilteredProperty = async (req, res) => {
  const body = req.body;
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};
