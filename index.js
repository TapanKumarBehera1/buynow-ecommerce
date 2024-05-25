const path = require("path");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const server = express();
// const mongoose = require("mongoose");
const orderRoute = require("./routes/orderRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const cartRoute = require("./routes/cartRoute");
const addressRoute = require("./routes/addressRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const paymentRoute = require("./routes/paymentRoute");
const walletRoute = require("./routes/walletRoute");
const walletRecordRoute = require("./routes/walletRecordRoute");
// const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./config/database");
const verifyToken = require("./middleware/common");
const webHookController = require("./webhook/webhookOperation");
databaseConnect().catch((error) => console.log(error));
// MongoDB database connection

//server middleware
server.use(express.static(process.env.PUBLIC_DIR));
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, //don't save session if modified
    saveUninitialized: false, //don't create session until something stored
  })
);

// server.use(
//   cors({
//     exposedHeaders: ["X-Total-Count"],
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// server.use(
//   cors({
//     exposedHeaders: ["X-Total-Count"],
//   })
// );

server.use(express.json());

//server route middleware
server.use("/products", verifyToken, productRoute);
server.use("/category", verifyToken, categoryRoute);
server.use("/brand", verifyToken, brandRoute);
server.use("/cart", verifyToken, cartRoute);
server.use("/wishlist", verifyToken, wishlistRoute);
server.use("/address", verifyToken, addressRoute);
server.use("/orders", verifyToken, orderRoute);
server.use("/wallet", verifyToken, walletRoute);
server.use("/walletrecord", verifyToken, walletRecordRoute);
server.use("/payment", verifyToken, paymentRoute);
server.use("/auth", authRoute);

server.post("/webhook", webHookController);

// server.post("/webhook", async (req, res) => {
//   const webhookSecret = process.env.RazorPay_key_Secret;
//   const signatureHeader = req.get("X-Razorpay-Signature");
//   const payload = JSON.stringify(req.body);
//   const webHookBody = req.body;
//   try {
//     const hmac = crypto.createHmac("sha256", webhookSecret);
//     hmac.update(payload);
//     const calculatedSignature = hmac.digest("hex");

//     if (signatureHeader === calculatedSignature) {
//       // Signature is valid (here checking valid signature)
//       const event = req.body.event;
//       if (event === "payment.authorized") {
//         //here i used payment.authorized event to target the user's authorized payment (this is a testing purpose event)
//         const orderID = webHookBody.payload.payment.entity.notes.orderID;
//         if (orderID) {
//           const order = await Order.findById(orderID);
//           order.paymentStatus = "received";
//           await order.save();
//           const user = await User.findById(order.user);
//           sendMail({
//             to: user.email,
//             html: invoiceTemplate(order),
//             subject: "Order Received",
//           });
//           return res.status(200).send("Webhook Received");
//         } else {
//           const amountInPaisa = webHookBody.payload.payment.entity.amount;
//           const userId = webHookBody.payload.payment.entity.notes.userId;
//           let amount = amountInPaisa / 100;
//           let userWallet = await Wallet.findOne({ user: userId });
//           let currentBalance = userWallet.wallet;
//           let totalBalance = currentBalance + amount;
//           userWallet.wallet = totalBalance;
//           await userWallet.save();
//           let saveRecord = await WalletRecord.create({
//             user: userId,
//             wallet: userWallet._id,
//             purpose: "add-money",
//             amount: amount,
//           });
//           await saveRecord.save();
//           return res.status(200).json({
//             addedamount: amount,
//             message: `wallet webhook ran and amount ${amount} added to your wallet`,
//           });
//         }
//       } else {
//         console.log("Unhandled event:", event);
//         return res.status(200).send("Webhook Received But Other Event Ran");
//       }
//     } else {
//       // Invalid signature
//       res.status(400).send("Invalid Signature");
//     }
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).send("Error processing webhook");
//   }
// });

server.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log("database connected");
// }

//port listen

server.listen(process.env.PORT, () => {
  console.log("server is started");
});
