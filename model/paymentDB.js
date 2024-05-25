const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
exports.Payment = mongoose.model("Payment", paymentSchema);
