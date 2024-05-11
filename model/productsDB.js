const mongoose = require('mongoose');
const { Schema } = mongoose;

const productShema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: [1, "wrong min price"] },
  discountPercentage: {
    type: Number,
    required: true,
    max: [0, "wrong min discountPercentage"],
    max: [99, "wrong max discountPercentage"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max rating"],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, "wrong min stock"],
    default: 0,
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
  wishlisted: { type: Boolean, default: false }
});

const virtual = productShema.virtual("id");
virtual.get(() => {
  return this._id;
});

productShema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productShema);
