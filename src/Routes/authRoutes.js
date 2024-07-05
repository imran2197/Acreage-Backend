const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/getAllUsers", authController.getAllUsers);
router.get("/getAllAgentsCities", authController.getAllAgentsCities);
router.post("/getUserData", authController.getUserData);
router.post("/saveUserData", authController.saveUserData);

module.exports = router;
