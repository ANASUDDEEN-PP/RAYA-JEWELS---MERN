const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = new Schema({
    UserId : {
        type : String
    },
    type : {
        type: String
    },
    name : {
        type: String
    },
    address : {
        type : String
    },
    city: {
        type :String
    },
    state : {
        type :String
    }, 
    zipCode : {
        type : String
    },
    phone : {
        type : String
    }
});

module.exports = mongoose.model('address', addressSchema);