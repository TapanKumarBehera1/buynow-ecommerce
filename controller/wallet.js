const { Wallet } = require("../model/walletDB");
const { User } = require("../model/userDB");

async function activateWalletRequest(req, res) {
  const { id } = req.user;
  let idproof = req.body.idproof;
  // let userWallet = await Wallet.findOne({ idproof });
  // if (userWallet) {
  //   return res.status(200).json({ existsId: "wallet already exists in this Id" });
  // }  will implement it later
  try {
    let userWallet = await Wallet.create({ user: id, wallet: 0, idproof });
    if (userWallet) {
      let user = await User.findOne({ _id: id });
      if (user.wallet === false) {
        user.wallet = true;
        await user.save();
        res.status(201).json({
          walletActivate: true,
          wallet: userWallet.wallet,
          message: "wallet activate successful",
        });
      } else {
        res.status(200).json({ message: "wallet already active" });
      }
    } else {
      res.status(400).json({ message: "wallet activate operation failed" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
}
async function fetchWalletBalanceByUser(req, res) {
  const { id } = req.user;
  try {
    const userWallet = await Wallet.findOne({ user: id });
    if (userWallet) {
      return res.status(200).json({ wallet: userWallet.wallet });
    }
  } catch (err) {
    res.status(400).json(err);
  }
}

async function addMoneyToWallet(req, res) {
  const { id } = req.user;
  let amount = req.body.amount;
  // Validate amount
  let userWallet = await Wallet.findOne({ user: id });
  if (!userWallet) {
    let userWallet = await Wallet.create({ user: id, wallet: amount });
    return res.status(200).json(userWallet);
  }
  if (!amount || isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  try {
    let userWallet = await Wallet.findOne({ user: id });
    let currentBalance = userWallet.wallet;
    let totalBalance = currentBalance + amount;
    userWallet.wallet = totalBalance;
    await userWallet.save();
    res.status(200).json({ addedamount: amount });
  } catch (err) {
    res.status(400).json(err);
  }
}
async function updateWalletBalance(req, res) {
  const { id } = req.user;
  let amount = req.body.amount;
  // Validate amount

  if (!amount || isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  try {
    let userWallet = await Wallet.findOne({ user: id });
    let currentBalance = userWallet.wallet;
    let totalBalance = currentBalance - amount;
    userWallet.wallet = totalBalance;
    await userWallet.save();
    res.status(200).json({ updatedAmount: amount });
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = {
  activateWalletRequest,
  fetchWalletBalanceByUser,
  addMoneyToWallet,
  updateWalletBalance,
};
