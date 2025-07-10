const notifyModel = require("../Models/notificationModel");

const orderModel = require("../Models/orderModel");
const productModel = require("../Models/productModel");
const userModel = require("../Models/userModel");
const moment = require('moment');

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

exports.setMarkAsRead = async(req, res) => {
  try{
    // console.log(req.body)
    const { notificationId } = req.body;
    await notifyModel.findByIdAndUpdate(
      {_id : notificationId},
      {$set : {
        MarkAsRead: true
      }},
      {new: true}
    )
    return res.status(200).json({ message : "Notification mark as Read.."})
  } catch(err){
    return res.status(404).json({
      message : "Internal Server Error"
    })
  }
}

exports.deleteNotification = async(req, res) => {
  try{
    // console.log(req.body)
    const { notificationId } = req.body;
    await notifyModel.findByIdAndDelete({ _id : notificationId });
    return res.status(200).json({ message : "Notification Deleted.."});
  } catch(err){
    return res.status(404).json({
      message : "Internal Server Error"
    })
  }
}

exports.dashboardAPI = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const products = await productModel.find({});
    const users = await userModel.find({});

    // Total counts
    const userCount = users.length;
    const productCount = products.length;
    const orderCount = orders.length;

    // Payment and Order Status Counts
    const paymentPending = orders.filter(pp => pp.paymentStatus === "pending");
    const paymentPaid = orders.filter(ppd => ppd.paymentStatus === "paid");
    const paymentFailed = orders.filter(pf => pf.paymentStatus === "failed");

    const orderProcessing = orders.filter(op => op.orderStatus === "Processing");
    const orderConfirm = orders.filter(oc => oc.orderStatus === "Confirmed");
    const orderShipped = orders.filter(os => os.orderStatus === "Shipped");
    const orderDelivered = orders.filter(od => od.orderStatus === "Delivered");
    const orderCancelled = orders.filter(ocd => ocd.orderStatus === "Cancelled");

    // 🗓️ Monthly Sales Data (For Grid or Chart)
    const monthlySales = {};

    orders.forEach(order => {
      if (order.paymentStatus === "paid") {
        const month = moment(order.orderDate, "DD MMMM YYYY | hh:mm A").format("YYYY-MM");
        if (!monthlySales[month]) {
          monthlySales[month] = {
            month,
            sales: 0,
            orders: 0
          };
        }

        const product = products.find(p => p._id.toString() === order.productId);
        const saleAmount = product ? parseFloat(product.OfferPrice) * parseInt(order.qty) : 0;

        monthlySales[month].sales += saleAmount;
        monthlySales[month].orders += 1;
      }
    });

    const monthlySalesGrid = Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month));

    // 📅 Last Month Sales Summary
    const lastMonthKey = moment().subtract(1, 'months').format("YYYY-MM");
    const lastMonthSale = monthlySales[lastMonthKey] || { sales: 0, orders: 0 };

    // 💰 Profit and Loss (Assuming NormalPrice as cost price)
    let profit = 0;
    let loss = 0;

    orders.forEach(order => {
      if (order.paymentStatus === "paid") {
        const product = products.find(p => p._id.toString() === order.productId);
        if (product) {
          const cost = parseFloat(product.NormalPrice);
          const selling = parseFloat(product.OfferPrice);
          const quantity = parseInt(order.qty);
          const totalProfit = (selling - cost) * quantity;

          if (totalProfit >= 0) {
            profit += totalProfit;
          } else {
            loss += Math.abs(totalProfit);
          }
        }
      }
    });

    // 📦 Final Dashboard Data
    const dashboardData = {
      userCount,
      productCount,
      orderCount,
      paymentPending: paymentPending.length,
      paymentPaid: paymentPaid.length,
      paymentFailed: paymentFailed.length,
      orderProcessing: orderProcessing.length,
      orderConfirm: orderConfirm.length,
      orderShipped: orderShipped.length,
      orderDelivered: orderDelivered.length,
      orderCancelled: orderCancelled.length,
      lastMonthSale,
      monthlySalesGrid,
      profit: profit.toFixed(2),
      loss: loss.toFixed(2)
    };

    return res.status(200).json({ dashboardData });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
