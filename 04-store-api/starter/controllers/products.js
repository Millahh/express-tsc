const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "a";
  //  const products = await Product.find({}).sort('name') // sort by name
  //  const products = await Product.find({}).sort('-name price') // desc sort by name, and asc by price
  //  const products = await Product.find({}).select('name price') // to show the certain field only
  //  const products = await Product.find({}).select('name price').limit(20).skip(5) // add limit of the response data
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
    // $regex = in this case, %value%
    // $options: 'i' = case INsensitive
  }); // for specific output, type ({ any_property: value}). exm: name:'millah'
  res.status(200).json({ products, nbHits: products.length });
  // u can use express-async-error package as well
  // throw new Error('testing async errors')
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    // change the url to -> .sort('-name price')
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // selected fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const products = await result;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit)
 
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
