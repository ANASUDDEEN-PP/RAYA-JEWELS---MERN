const express = require("express");
const router = express.Router();

//Import Controller
const AuthController = require("../Controllers/authController");

router.post('/register', AuthController.userRegister);
router.get('/get/all', AuthController.getAllUsers);

module.exports = router;