const paymentDB = require("../model/paymentDB");
const Payment = paymentDB.Payment;
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RazorPay_key_Id,
  key_secret: process.env.RazorPay_key_Secret,
});

async function createOrderCheckout(req, res) {
  const { amount, cartOrderID } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
    notes: {
      orderID: cartOrderID,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
}
async function createOrderWallet(req, res) {
  const { amount,userID } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
    notes: {
      userId:userID
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating wallet order");
  }
}

async function orderPaymentVerification(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RazorPay_key_Secret)
    .update(body.toString())
    .digest("hex");
  const isAuth = expectedSignature === razorpay_signature;
  if (isAuth) {
    let payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return res.status({
      payment: "success",
      data: payment.razorpay_payment_id,
    });
    // res.redirect(
    //   `http://localhost:5173/order-success?reference=${razorpay_payment_id}`
    // );
  } else {
    res
      .status(400)
      .send({ message: false, payment: "failed", data: "payment failed" });
  }
}

async function getKey(req, res) {
  return res.status(200).json({ key: process.env.RazorPay_key_Id });
}

module.exports = {
  createOrderCheckout,
  orderPaymentVerification,
  getKey,
  createOrderWallet,
};
