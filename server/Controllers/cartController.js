const cartModel = require("../Models/addToChart");
const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel")

exports.addToCart = async (req, res) => {
    try {
        const { UserId, Quantity, itemsData } = req.body;

        // Validate input
        if (!UserId || !Quantity || !itemsData) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if quantity is valid
        if (Quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        // Check if product exists
        const product = await productModel.findById(itemsData);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user exists
        const user = await userModel.findById(UserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find or create cart
        let cart = await cartModel.findOne({ UserId });

        if (cart) {
            // If item already exists in cart, update quantity
            const itemIndex = cart.Items.findIndex(item => item.type.toString() === itemsData);

            if (itemIndex > -1) {
                const newQty = cart.Items[itemIndex].Qty + Quantity;
                cart.Items[itemIndex].Qty = newQty;
            } else {
                cart.Items.push({ type: itemsData, Qty: Quantity });
            }
            await cartModel.findByIdAndUpdate(
                { _id: cart._id },
                { $set: cart },
                { new: true }
            )
            return res.status(200).json({
                message: "Item added to cart successfully..."
            })
        } else {
            // Create new cart if it doesn't exist
            const newCart = {
                UserId,
                Date: Date.now(),
                Items: [{ type: itemsData, Qty: Quantity }]
            };
            await cartModel.create(newCart);
            return res.status(200).json({
                message: "Build Cart... Item Added To Cart",
            });
        }
    } catch (err) {
        console.error("Error in addToCart:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}