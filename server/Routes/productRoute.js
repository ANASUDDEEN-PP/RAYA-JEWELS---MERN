const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController")

router.post('/create', productController.createProduct);
router.get('/get/collection/product/:id', productController.getProductOrderedByCollection);

module.exports = router;