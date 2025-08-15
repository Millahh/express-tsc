const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = 'a'
//  const products = await Product.find({}).sort('name') // sort by name
//  const products = await Product.find({}).sort('-name' price) // desc sort by name, and asc by price
  const products = await Product.find({
    name: { $regex:search, $options:'i'}
    // $regex = in this case, %value%
    // $options: 'i' = case INsensitive
  }); // for specific output, type ({ any_property: value}). exm: name:'millah'
  res.status(200).json({ products, nbHits: products.length });
  // u can use express-async-error package as well
  // throw new Error('testing async errors')
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
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

  let result = Product.find(queryObject);
   if(sort){
    // change the url to -> .sort('-name' price)
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
   }else{
    result = result.sort('createdAt')
   }
   const products = await result
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
