const express = require("express");
const {
  fetchWalletBalanceByUser,
  addMoneyToWallet,
  activateWalletRequest,
  updateWalletBalance,
} = require("../controller/wallet");
const walletRoute = express.Router();

walletRoute
  .post("/activate-wallet", activateWalletRequest)
  .get("/", fetchWalletBalanceByUser)
  .post("/addbalance", addMoneyToWallet)
  .post("/updatebalance", updateWalletBalance)
module.exports = walletRoute;
