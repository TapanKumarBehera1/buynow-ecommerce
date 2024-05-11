const { Order } = require("../model/orderDB");
const { Product } = require("../model/productsDB");
const { User } = require("../model/userDB");
const { Wallet } = require("../model/walletDB");
const { WalletRecord } = require("../model/walletRecordDB");
const { sendMail, invoiceTemplate } = require("../services/common");

const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    // const orders = await Order.find({ user: id });
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createOrder = async (req, res) => {
  const order = new Order(req.body);
  // here we have to update stocks;
  for (let item of order.items) {
    let product = await Product.findOne({ _id: item.product.id });
    product.$inc("stock", -1 * item.quantity);
    await product.save();
  }

  try {
    const doc = await order.save();
    const user = await User.findById(order.user);
    // we can use await for this also
    if (order.paymentMethod === "cash") {
      sendMail({
        to: user.email,
        html: invoiceTemplate(order),
        subject: "Order Received",
      });
    } else if (order.paymentMethod === "BN-wallet") {
      let { id } = req.user;
      let userWallet = await Wallet.findOne({ user: id });
      let currentBalance = userWallet.wallet;
      let totalBalance = currentBalance - order.totalAmount;
      userWallet.wallet = totalBalance;
      await userWallet.save();
      let saveRecord = await WalletRecord.create({
        user: order.user,
        wallet: userWallet._id,
        purpose: "shopping",
        amount: order.totalAmount,
      });
      await saveRecord.save();
      sendMail({
        to: user.email,
        html: invoiceTemplate(order),
        subject: "Order Received",
      });
    }
    //if the user choose cash payment option then send to user order received notification via email

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const fetchAllOrders = async (req, res) => {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  fetchOrdersByUser,
  createOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
};
