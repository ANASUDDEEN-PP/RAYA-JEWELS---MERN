const addressModel = require("../Models/AddressModel");
const orderModel = require("../Models/orderModel");
const dateFormat = require("../utils/dateFormat");

exports.addOrder = async (req, res) => {
  try {
    let addressData = {};
    const { productId, customerId, paymentType,
      addressId,
      address,
      city,
      name,
      phone,
      state,
      zipCode,
      saveAddress,
    } = req.body;
    // console.log(productId, customerId, paymentType, addressId, address, city, name, phone, state, zipcode, saveAddress)
    if (saveAddress === true && addressId === "") {
      addressData = {
        UserId: customerId,
        type: "Order Address",
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        isSaved: saveAddress,
      };
      console.log(addressData);
    } else {
      //code to set order
      addressData = {
        UserId: customerId,
        type: "",
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        isSaved: saveAddress,
      };
    }
    const addresses = await addressModel.create(addressData);

    //Generate OrderId
    let genOrderId = '';
    const year = new Date().getFullYear();
    const orderCount = await orderModel.countDocuments();
    if(orderCount === 0)
        genOrderId = `RAYA/${year}/ORD/0001`
    else {
        const lastOrderId = await orderModel.findOne().sort({ _id: -1 });
    }

    const orderData = {
        orderID : genOrderId,
        productId,
        customerId,
        paymentType,
        addressId,
        paymentStatus : 'pending',
        orderStatus : 'pending',
        orderDate : dateFormat('NNMMYY|TT:TT'),
        deliveredDate : '',
        trackId : ''
    }
    console.log(orderData);
  } catch (err) {
    return res.status(404).json({
      message: "Internal Server Error",
    });
  }
};
