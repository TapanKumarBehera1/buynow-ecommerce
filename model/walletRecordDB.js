const mongoose = require("mongoose");
const { Schema } = mongoose;

const walletRecordSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    purpose: { type: String, required: true },
    amount: { type: String, required: true },
  },
  { timestamps: true }
);

const virtual = walletRecordSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
walletRecordSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.WalletRecord = mongoose.model("WalletRecord", walletRecordSchema);
