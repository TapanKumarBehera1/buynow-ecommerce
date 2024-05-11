const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  wishlist: [],
  cart: [],
  addresses: { type: [Schema.Types.Mixed] },
  // wallet: { type: Number ,default:100},
  wallet: { type: Boolean ,default:false},
  resetPasswordToken: {type: String, default:''},
  },{timestamps:true});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
