const { Product } = require("../model/productsDB");

const fetchAllProducts = async (req, res) => {
  let query = Product.find({deleted:{$ne:true}});
  let totalProductsQuery = Product.find({deleted:{$ne:true}});
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }

  // if (req.query.brand) {
  //   query = query.find({ brand: req.query.brand });
  //   totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  // }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProductsQuery = totalProductsQuery.sort({
      [req.query._sort]: req.query._order,});
  }

  let totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res
      .status(400)
      .json({ message: "failed", data: "products fetching failed" });
  }
};

const getProductById = async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "product fetching failed" });
  }
};
const createANewProduct = async (req, res) => {
  let product = await Product({ ...req.body });
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  fetchAllProducts,
  getProductById,
  createANewProduct,
  updateProduct,
};
