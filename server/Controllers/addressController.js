const addressModel = require("../Models/AddressModel");
const userModel = require("../Models/userModel");

exports.addAddress = async(req, res) => {
    try{
        const { type, name, address, city, state, zipCode, phone, id } = req.body;
        const isUser = await userModel.findById(id)
        if(!isUser)
            return res.status(404).json({ message : "NoUserOnMyRecord" });
        const addressData = {
            UserId : isUser._id,
            type, name, address, city, state, zipCode, phone
        }
        await addressModel.create(addressData);
        return res.status(200).json({ message : "Address Added..."})
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}

exports.getAddressByUserId = async(req, res) => {
    try{
        const { id } = req.params;
        if(!await userModel.findById(id))
            return res.status(404).json({ message : "NoUserOnRecord" });
        const address = await addressModel.find({ UserId : id });
        return res.status(200).json({address});
    } catch(err){
        return res.status(404).json({ message : "Internal Server Error" });
    }
}