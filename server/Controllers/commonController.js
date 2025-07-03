const notifyModel = require("../Models/notificationModel");

exports.getAllNotification = async (req, res) => {
    try{
        const allNotifications = await notifyModel.find({});
        return res.status(200).json({allNotifications})
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}