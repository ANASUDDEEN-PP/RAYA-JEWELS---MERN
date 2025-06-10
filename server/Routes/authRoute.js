const express = require("express");
const router = express.Router();

//Import Controller
const AuthController = require("../Controllers/authController");

router.post('/register', AuthController.userRegister);

module.exports = router;