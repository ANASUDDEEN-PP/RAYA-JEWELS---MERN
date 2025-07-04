const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    orderID : {
        type: String
    },
    productId : {
        type :String
    },
    customerId : {
        type :String
    },
    paymentType : {
        type : String
    },
    addressId : {
        type : String
    },
    paymentStatus : {
        type : String
    },
    orderStatus : {
        type: String
    },
    orderDate : {
        type : String
    },
    deliveredDate : {
        type: String
    },
    trackId : {
        type: String
    }
});

module.exports = mongoose.model('orders', orderSchema);