const express = require("express");
const { fetchCartByUser, deleteFromCart,updateCart,addToCart } = require("../controller/cart");
const cartRoute = express.Router();

cartRoute
  .post("/", addToCart)
  .get("/",fetchCartByUser )
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

module.exports = cartRoute;
