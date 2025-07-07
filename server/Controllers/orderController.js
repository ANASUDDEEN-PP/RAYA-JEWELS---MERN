const addressModel = require("../Models/AddressModel");
const orderModel = require("../Models/orderModel");
const gPayDetailsModel = require("../Models/gPayPaymentModel");
const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel");
const dateFormat = require("../utils/dateFormat");
const sendNotify = require("../utils/sendNotify")

exports.addOrder = async (req, res) => {
  try {
    const {
      productId, customerId, paymentType,
      addressId, address, city, name, phone,
      state, zipCode, saveAddress, qty, size
    } = req.body;

    let addressDoc = null;

    if (!addressId || saveAddress === true) {
      const addressData = {
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
      addressDoc = await addressModel.create(addressData);
    }

    const finalAddressId = addressId || (addressDoc && addressDoc._id);

    // Generate Order ID
    const year = new Date().getFullYear();
    const orderCount = await orderModel.countDocuments();
    let genOrderId = '';

    if (orderCount === 0) {
      genOrderId = `RAYA/${year}/ORD/0001`;
    } else {
      const lastOrder = await orderModel.findOne().sort({ _id: -1 });
      const lastOrdId = lastOrder.orderID?.split('/').pop();
      const nextOrdId = String(parseInt(lastOrdId) + 1).padStart(4, '0');
      genOrderId = `RAYA/${year}/ORD/${nextOrdId}`;
    }

    const orderData = {
      orderID: genOrderId,
      customerId,
      productId: productId.toString(),
      paymentType,
      addressId: finalAddressId,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      orderDate: dateFormat('NNMMYY|TT:TT'),
      deliveredDate: '',
      trackId: '',
      size,
      qty,
    };

    await orderModel.create(orderData);

    return res.status(201).json({
      message: "Order placed successfully",
      orderID: genOrderId
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.googlePayPaymentDetails = async (req, res) => {
  try {
    const { orderId, screenshotBase64, screenshotName, paymentType } = req.body;
    // console.log(paymentType)

    const isExist = await orderModel.findOne({ orderID: orderId });

    if (!isExist) {
      return res.status(404).json({ message: "NoProductAvailable" });
    }

    if (paymentType == "UPI") {     //For UPI
      const paymentData = {
        orderId: isExist._id,
        screenshotBase64,
        screenshotName,
        Date: dateFormat('NNMMYY|TT:TT')
      };

      const payment = await gPayDetailsModel.create(paymentData);
      if (!payment) {
        return res.status(500).json({ message: "Something Went Wrong..." });
      }

      await orderModel.findByIdAndUpdate(
        isExist._id,
        { $set: { paymentType: paymentType } },
        { new: true }
      );

      sendNotify({
        product: isExist.orderID,
        Qty: isExist.qty
      }, 'ORDPRCS');

      // console.log(user,product)
      sendNotify({
        product: isExist.orderID,
        Qty: isExist.qty
      }, 'ORDPYMT');

      return res.status(200).json({
        message: "Payment Request Completed Successfully..."
      });
    } else if (paymentType == "cod") {    //for COD
      await orderModel.findByIdAndUpdate(
        isExist._id,
        { $set: { paymentType: paymentType } },
        { new: true }
      );
      sendNotify({
        product: isExist.orderID,
        Qty: isExist.qty
      }, 'ORDPRCS');
      return res.status(200).json({
        message: "Order requested...."
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
