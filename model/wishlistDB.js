const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistShema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const virtual = wishlistShema.virtual("id");
virtual.get(() => {
  return this._id;
});

wishlistShema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Wishlist = mongoose.model("Wishlist", wishlistShema);
