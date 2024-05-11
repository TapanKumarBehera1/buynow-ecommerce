const { Brand } = require("../model/brandDB");;


 async function fetchAllBrands(req, res) {
    try {
      const brands = await Brand.find({})
      res.status(200).json(brands);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  async function addNewBrand(req, res)  {
    const brand= new Brand({...req.body});
    try {
      const doc = await brand.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  async function deleteBrand  (req, res)  {
      const { id } = req.params;
      try {
      const doc = await Brand.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
   async function updateBrand (req, res) {
    const { id } = req.params;
    try {
      const brand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(brand);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  

module.exports={fetchAllBrands,addNewBrand,updateBrand,deleteBrand}