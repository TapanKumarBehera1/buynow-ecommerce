const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  razorpay_order_id: {type: String,required: true},
  razorpay_payment_id: {type: String,required: true},
  razorpay_signature: {type: String,required: true},
});
exports.Payment = mongoose.model("Payment", paymentSchema);
