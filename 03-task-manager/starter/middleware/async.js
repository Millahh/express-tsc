const asyncWrapper = (fn) => {
    return async (req, res, next) => {
         try{
            // execute controller
            await fn(req, res, next)
         } catch (error) {
            // throw error to middleware error-handler
            next (error)
         }
    }
}

module.exports = asyncWrapper