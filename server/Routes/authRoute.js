const express = require("express");
const router = express.Router();

//Import Controller
const AuthController = require("../Controllers/authController");

router.post('/register', AuthController.userRegister);
router.get('/get/all', AuthController.getAllUsers);
router.get('/get/user/:id', AuthController.getUserById);
router.post('/set/profile/img/:id', AuthController.setUserProfileImage);
router.get('/get/profile/image/:id', AuthController.getProfileImage);
router.put('/edit/profile/:id', AuthController.editUserProfileData);

module.exports = router;