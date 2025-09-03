const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]
  try {
    // get decoded user information from the token given
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    // change the req.user
    req.user = { id, username };
    // pass to the middleware/route which defined on route/main.js line 8. next to dashboard route on main.js file
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;
