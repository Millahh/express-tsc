const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ page: "2" }); // for specific output, type ({ any_property: value})
  res.status(200).json({ products, nbHits: products.length });
  // u can use express-async-error package aswell
  // throw new Error('testing async errors')
};
const getAllProducts = async (req, res) => {
  const { featured } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  console.log(queryObject);

  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
