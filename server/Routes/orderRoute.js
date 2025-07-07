const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController")

router.post('/add', orderController.addOrder);
router.post('/gpay/payment/details', orderController.googlePayPaymentDetails);
router.get('/get/all/orders', orderController.getAllOrders)

module.exports = router;