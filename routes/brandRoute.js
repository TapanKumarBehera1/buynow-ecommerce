const express = require("express");
const {
  addNewBrand,
  fetchAllBrands,
  deleteBrand,
  updateBrand,
} = require("../controller/brand");
const brandRoute = express.Router();

brandRoute
  .post("/", addNewBrand)
  .get("/", fetchAllBrands)
  .delete("/:id", deleteBrand)
  .patch("/:id", updateBrand);

module.exports = brandRoute;
