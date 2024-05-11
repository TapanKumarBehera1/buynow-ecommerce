const express = require("express");
const wishlistRoute = express.Router();
const {
  addToWishlist,
  getWishlistItemsByUser,
  removeFromWishlist,
} = require("../controller/wishlist");

wishlistRoute.post("/", addToWishlist);
wishlistRoute.get("/", getWishlistItemsByUser);
wishlistRoute.delete("/:id", removeFromWishlist);

module.exports = wishlistRoute;
