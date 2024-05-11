const { Wishlist } = require("../model/wishlistDB");

async function addToWishlist(req, res) {
  const { id } = req.user;
  const wishlist = new Wishlist({ ...req.body, user: id });
  try {
    const doc = await wishlist.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}
async function getWishlistItemsByUser(req, res) {
  const { id } = req.user;
  try {
    let wishlistItems = await Wishlist.find({ user: id}).populate("product");
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function removeFromWishlist(req, res) {
  const { id } = req.params;
  try {
    const doc = await Wishlist.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = { addToWishlist, getWishlistItemsByUser, removeFromWishlist };
