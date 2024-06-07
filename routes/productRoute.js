const express = require("express");
const productRoute = express.Router();
const {
  fetchAllProducts,
  getProductById,
  createANewProduct,
  updateProduct,
} = require("../controller/products");
const upload = require("../config/multer");
const verifyToken = require("../middleware/common");

const cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

productRoute.get("/", fetchAllProducts);
productRoute.get("/:id", getProductById);
productRoute.post("/", verifyToken, cpUpload, createANewProduct);
productRoute.patch("/:id", verifyToken, updateProduct);

module.exports = productRoute;
