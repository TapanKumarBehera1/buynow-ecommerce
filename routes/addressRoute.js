const express = require("express");
const { fetchAddressByUser, addAddress,deleteAddress,updateAddress } = require("../controller/address");
const addressRoute = express.Router();

addressRoute
.get("/",fetchAddressByUser )
  .post("/", addAddress)
  .delete("/:id", deleteAddress)
  .patch("/:id", updateAddress);

module.exports = addressRoute;
