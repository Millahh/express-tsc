const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({}) // for specific output, type ({ any_property: true})
    res.status(200).json({ products })
    // u can use express-async-error package aswell
    // throw new Error('testing async errors')
}
const getAllProducts = async (Request, res) => {
    res.status(200).json({ msg: 'products route' })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}