const express = require("express");
const router = express.Router();

const commonController = require("../Controllers/commonController");
router.get('/get/all/notification', commonController.getAllNotification);
router.put('/mark/notification/as/read', commonController.setMarkAsRead);
router.delete('/delete/notification', commonController.deleteNotification)
router.get('/get/dashboard/data', commonController.dashboardAPI);

module.exports = router;


// /get/dashboard/data