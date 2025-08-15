const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = 'a'
  const products = await Product.find({
    name: { $regex:search, $options:'i'}
    // $regex = in this case, %value%
    // $options: 'i' = case INsensitive
  }); // for specific output, type ({ any_property: value}). exm: name:'millah'
  res.status(200).json({ products, nbHits: products.length });
  // u can use express-async-error package aswell
  // throw new Error('testing async errors')
};
const getAllProducts = async (req, res) => {
  const { featured, company, name } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex:search, $options:'i'};
  }
  console.log(queryObject);

  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
