const express = require("express");
const {
  addNewBrand,
  fetchAllBrands,
  deleteBrand,
  updateBrand,
} = require("../controller/brand");
const verifyToken = require("../middleware/common");
const brandRoute = express.Router();

brandRoute
  .post("/", verifyToken, addNewBrand)
  .get("/", fetchAllBrands)
  .delete("/:id", verifyToken, deleteBrand)
  .patch("/:id", verifyToken, updateBrand);

module.exports = brandRoute;
