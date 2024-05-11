const express = require("express");
const {
  fetchWalletTransactionByUser,
} = require("../controller/walletRecord");
const walletRecordRoute = express.Router();

walletRecordRoute
  .get("/", fetchWalletTransactionByUser)
module.exports = walletRecordRoute;
