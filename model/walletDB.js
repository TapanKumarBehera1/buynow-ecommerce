const mongoose = require("mongoose");
const { Schema } = mongoose;

const walletSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  wallet: {
    type: Number,
    required: true,
    min: [0, "wrong min amount in wallet"],
  },
  idproof: { type: String, required: true },
},{timestamps:true});

const virtual = walletSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
walletSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Wallet = mongoose.model("Wallet", walletSchema);
