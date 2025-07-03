const express = require("express");
const router = express.Router();

const commonController = require("../Controllers/commonController");
router.get('/get/all/notification', commonController.getAllNotification);

module.exports = router;
