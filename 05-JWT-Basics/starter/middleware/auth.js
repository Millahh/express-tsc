const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    // get decoded user information from the token given
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    // change the req.user
    req.user = { id, username };
    // pass to the middleware/route which defined on route/main.js line 8. next to dashboard route on main.js file
    next();
  } catch (error) {
    throw new CustomAPIError("Not authorized to access this route", 401);
  }
};

module.exports = authenticationMiddleware;
