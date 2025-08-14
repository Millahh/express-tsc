const asyncWrapper = (fn) => {
    return async (req, res, next) => {
         try{
            // execute controller
            await fn(req, res, next)
         } catch (error) {
            // throw error to middleware error-handler (by default)
            // in this case, we pass to the next (custom) middleware
            // app.use(errorHandlerMiddleware). defined on app.js file
            next (error)
         }
    }
}

module.exports = asyncWrapper