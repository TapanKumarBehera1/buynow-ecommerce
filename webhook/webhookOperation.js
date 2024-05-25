import { Order } from "../model/orderDB";
import { Payment } from "../model/paymentDB";
import { User } from "../model/userDB";
import { Wallet } from "../model/walletDB";
import { WalletRecord } from "../model/walletRecordDB";
import { invoiceTemplate, sendMail } from "../services/common";

const webHookController = async (req, res) => {
  const webhookSecret = process.env.RazorPay_key_Secret;
  const signatureHeader = req.get("X-Razorpay-Signature");
  const payload = JSON.stringify(req.body);
  const webHookBody = req.body;
  try {
    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest("hex");

    if (signatureHeader === calculatedSignature) {
      // Signature is valid (here checking valid signature)
      const event = req.body.event;
      if (event === "payment.authorized") {
        //here i used payment.authorized event to target the user's authorized payment (this is a testing purpose event)
        const orderID = webHookBody.payload.payment.entity.notes.orderID;
        const razorpay_payment_id = webHookBody.payload.payment.entity.id;
        const razorpay_order_id = webHookBody.payload.payment.entity.order_id;
        const amountInPaisa = webHookBody.payload.payment.entity.amount;
        const razorpay_signature = signatureHeader;
        const amount = amountInPaisa / 100;

        if (orderID) {
          const order = await Order.findById(orderID);
          order.paymentStatus = "received";
          await order.save();
          const user = await User.findById(order.user);
          await sendMail({
            to: user.email,
            html: invoiceTemplate(order),
            subject: "Order Received",
          });
          await Payment.create({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            amount,
            order: orderID,
          });
          return res.status(200).send("Webhook Received");
        } else {
          const userId = webHookBody.payload.payment.entity.notes.userId;
          let userWallet = await Wallet.findOne({ user: userId });
          let currentBalance = userWallet.wallet;
          let totalBalance = currentBalance + amount;
          userWallet.wallet = totalBalance;
          await userWallet.save();
          let saveRecord = await WalletRecord.create({
            user: userId,
            wallet: userWallet._id,
            purpose: "add-money",
            amount: amount,
          });
          await saveRecord.save();
          return res.status(200).json({
            addedamount: amount,
            message: `wallet webhook ran and amount ${amount} added to your wallet`,
          });
        }
      } else {
        console.log("Unhandled event:", event);
        return res.status(200).send("Webhook Received But Other Event Ran");
      }
    } else {
      // Invalid signature
      res.status(400).send("Invalid Signature");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook");
  }
};

module.exports = webHookController;
