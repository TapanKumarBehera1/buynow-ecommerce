const { Category } = require("../model/categoryDB");;


 async function fetchAllCategories(req, res) {
    try {
      const categories = await Category.find({})
      res.status(200).json(categories);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  async function addNewCategory(req, res)  {
    const category= new Category({...req.body});
    try {
      const doc = await category.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  async function deleteCategory  (req, res)  {
      const { id } = req.params;
      try {
      const doc = await Category.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
   async function updateCategory (req, res) {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(category);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  

module.exports={fetchAllCategories,addNewCategory,updateCategory,deleteCategory}