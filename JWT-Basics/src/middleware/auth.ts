import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedError } from "../errors";
import { Request, Response, NextFunction } from "express";

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]
  try {
    // get decoded user information from the token given
    // jwt.verify returns string | JwtPayload, so we need to typecast
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: string;
      username: string;
    }

    req.user = { id: decoded.id, username: decoded.username }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

export default authenticationMiddleware;
