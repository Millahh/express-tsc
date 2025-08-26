const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "a";
  //  const products = await Product.find({}).sort('name') // sort by name
  //  const products = await Product.find({}).sort('-name price') // desc sort by name, and asc by price
  //  const products = await Product.find({}).select('name price') // to show the certain field only
  //  const products = await Product.find({}).select('name price').limit(20).skip(5) // add limit of the response data
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
    price: { $gt: 20 },
    // $regex = in this case, %value%
    // $options: 'i' = case INsensitive
    // $gt = greater than
  }); // for specific output, type ({ any_property: value}). exm: name:'millah'
  res.status(200).json({ products, nbHits: products.length });
  // u can use express-async-error package as well
  // throw new Error('testing async errors')
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // numericFilters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt", //greater than
      ">=": "$gte", //greater than equal
      "=": "$eq", //equal
      "<": "$lt", //less than
      "<=": "$lte", //less than equal
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `—${operatorMap[match]}—`
    );
    const options = ["price"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("—");
      if (options.includes(field)) {
        if (!queryObject[field]) queryObject[field] = {};
        queryObject[field][operator] = Number(value);
      }
    });
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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
