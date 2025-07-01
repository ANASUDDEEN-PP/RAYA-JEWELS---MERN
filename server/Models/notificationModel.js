const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new Schema ({
    userId : {
        type : String
    },
    Notification : {
        type : String
    },
    Category : {
        type : String
    },
    createdDate : {
        type : String
    }
});

module.exports = mongoose.model('Notify', notificationSchema);