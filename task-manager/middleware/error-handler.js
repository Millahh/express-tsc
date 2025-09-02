const { CustomAPIError } = require('../errors/custom-error')
const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomAPIError){
        // err.statusCode is defined on controller line 22-23
        return res.status(err.statusCode).json({ msg: err.message })
    }
    return res.status(500).json({ msg:'Something went wrong, please try again' })
} 

module.exports = errorHandlerMiddleware