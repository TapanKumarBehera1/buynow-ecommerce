const express = require("express");
const productRoute = express.Router();
const {fetchAllProducts,getProductById,createANewProduct, updateProduct} = require("../controller/products");

productRoute.get("/",fetchAllProducts);
productRoute.get("/:id", getProductById);
productRoute.post("/", createANewProduct);
productRoute.patch("/:id", updateProduct);


module.exports = productRoute;
