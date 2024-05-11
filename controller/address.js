const { Address } = require("../model/addressDB");

async function fetchAddressByUser(req, res) {
  const { id } = req.user;
  try {
    const addresses = await Address.find({ user: id });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function addAddress(req, res) {
  const { id } = req.user;
  const address = new Address({ ...req.body, user: id });
  try {
    const doc = await address.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function deleteAddress(req, res) {
  const { id } = req.params;
  try {
    const doc = await Address.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function updateAddress(req, res) {
  const { id } = req.params;
  try {
    const updatedAddress = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = {
  fetchAddressByUser,
  addAddress,
  deleteAddress,
  updateAddress,
};
