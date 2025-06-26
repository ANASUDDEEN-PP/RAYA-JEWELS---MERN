const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema ({
    UserId : {
        type : String
    },
    Date : {
        type : String
    },
    Items : {
        type : Object
    }
});
module.exports = mongoose.model('cart', cartSchema);