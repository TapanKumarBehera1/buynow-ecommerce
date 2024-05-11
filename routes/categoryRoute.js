const express = require("express");
const { fetchAllCategories,addNewCategory,deleteCategory,updateCategory } = require("../controller/category");
const categoryRoute = express.Router();

categoryRoute
  .post("/", addNewCategory)
  .get("/",fetchAllCategories )
  .delete("/:id", deleteCategory)
  .patch("/:id", updateCategory);

module.exports = categoryRoute;
