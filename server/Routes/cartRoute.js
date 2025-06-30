const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");

router.post('/add/item', cartController.addToCart);
router.get('/get/:id', cartController.getCartOfUser);

module.exports = router;