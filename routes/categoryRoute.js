const express = require("express");
const {
  fetchAllCategories,
  addNewCategory,
  deleteCategory,
  updateCategory,
} = require("../controller/category");
const verifyToken = require("../middleware/common");
const categoryRoute = express.Router();

categoryRoute
  .post("/", verifyToken, addNewCategory)
  .get("/", fetchAllCategories)
  .delete("/:id", verifyToken, deleteCategory)
  .patch("/:id", verifyToken, updateCategory);

module.exports = categoryRoute;
