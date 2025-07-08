const express = require("express");
const router = express.Router();

//Import Controller
const AuthController = require("../Controllers/authController");

router.post('/register', AuthController.userRegister);
router.get('/get/all', AuthController.getAllUsers);
router.get('/get/user/:id', AuthController.getUserById)

module.exports = router;