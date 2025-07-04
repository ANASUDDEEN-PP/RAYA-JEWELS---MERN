const express = require("express");
const router = express.Router();

//Import Controller
const addressController = require("../Controllers/addressController");

router.post('/add', addressController.addAddress);
router.get('/get/:id', addressController.getAddressByUserId);

module.exports = router;