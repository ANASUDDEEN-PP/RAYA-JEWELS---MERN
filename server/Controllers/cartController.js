const cartModel = require("../Models/addToChart");
const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel")

exports.addToCart = async (req, res) => {
    try{
        const { UserId, Quantity, itemsData } = req.body;
        if(!await productModel.findById({ _id : itemsData }))
            return res.status(401).json({ message : "InvalidProductId" });
        if(!await userModel.findById({ _id : UserId }))
            return res.status(401).json({ message : "NoUserOnRecord"});
        let cart = await cartModel.findOne({ UserId });
        if(cart){
            const existItems = cart.Items.findIndex( (item) => item.type.toString() === itemsData );
            if(existItems > -1)
                cart.Items[existItems].Qty += Quantity;
            else
                cart.Items.push({ type : itemsData, Qty : Quantity });
            await cart.save();
        } else {
            const cartData = {
                UserId,
                Date : Date.now(),
                Items: [{ type: itemsData, Qty: Quantity }]
            }
            // console.log(cartData)
            await cartModel.create(cartData)
        }
        return res.status(200).json({ message: "Item added to cart successfully" });
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}