const errorHandlerMiddleware = (err, req, res, next) => {
    return res.status(500).json({ msg:err })
    // or you can modify the message
    // return res.status(500).json({ msg:'error, try again' })
} 

module.exports = errorHandlerMiddleware