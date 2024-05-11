const path=require("path")
const express = require("express");
const orderRoute = express.Router();
const {
  createOrderCheckout,
  orderPaymentVerification,
  getKey,
  createOrderWallet
} = require("../controller/payment");

orderRoute.get("/getkey", getKey);
orderRoute.post("/checkout", createOrderCheckout);
orderRoute.post("/wallet", createOrderWallet);
orderRoute.post("/paymentverification", orderPaymentVerification);


module.exports = orderRoute;
