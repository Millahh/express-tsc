const getAllProductsStatic = async (req, res) => {
    throw new Error('testing async errors')
    // using express-async-error package instead
    // res.status(200).json({ msg: 'products testing route' })
}
const getAllProducts = async (Request, res) => {
    res.status(200).json({ msg: 'products route' })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}