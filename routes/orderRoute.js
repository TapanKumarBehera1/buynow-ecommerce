const express = require("express");
const orderRoute = express.Router();
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controller/order");


orderRoute
  .post("/", createOrder)
  .get("/own", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

module.exports = orderRoute;
