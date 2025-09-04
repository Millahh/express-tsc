import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  }
}

const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Please provide username and password");
  }
  const id = new Date().getDate();

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.username}`, // from req.user
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

export { login, dashboard };
