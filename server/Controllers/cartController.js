const cartModel = require("../Models/addToChart");
const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel");
const imageModel = require("../Models/ImageModel");

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

exports.getCartOfUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userExists = await userModel.findById(id);
        if (!userExists)
            return res.status(401).json({ message: "NoUserOnOurRecord" });

        const cartItems = await cartModel.findOne({ UserId: id });
        if (cartItems && cartItems.Items) {
            const userCartItems = [];
            for (let i = 0; i < cartItems.Items.length; i++) {
                const item = cartItems.Items[i];
                if (!item || !item.type || !item.Qty) continue; // skip if data is malformed

                const productData = await productModel.findById(item.type);
                if (!productData) continue;

                const productImage = await imageModel.findOne({ imageId: productData._id });

                userCartItems.push({
                    id: cartItems._id,
                    productId: productData._id,
                    image: productImage?.ImageUrl || null,
                    name: productData.ProductName,
                    price: productData.OfferPrice,
                    quantity: item.Qty
                });
            }

            return res.status(200).json({ userCartItems });
        }

        return res.status(200).json({
            message: "No Products On Cart"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.editCartQty = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, productId } = req.body;
        console.log(productId, action, id);

        const isCart = await cartModel.findById(id);
        console.log(isCart);
        if (!isCart)
            return res.status(401).json({ message: "InvalidId" });

        if (!await productModel.findById(productId))
            return res.status(401).json({ message: "NoProductHave" });

        const itemIndex = isCart.Items.findIndex(i => i.type.toString() === productId.toString());

        if (itemIndex !== -1) {
            if (action === 'increase') {
                isCart.Items[itemIndex].Qty += 1;
            } else if (action === 'decrease') {
                isCart.Items[itemIndex].Qty = Math.max(1, isCart.Items[itemIndex].Qty - 1);
            }
            await isCart.save();
            return res.status(200).json({ message: "Cart updated", cart: isCart });
        } else {
            return res.status(404).json({ message: "Item not found in cart" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
