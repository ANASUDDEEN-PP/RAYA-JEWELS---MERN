const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController")

router.post('/create', productController.createProduct);

module.exports = router;