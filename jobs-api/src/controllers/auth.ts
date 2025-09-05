import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";

// register
export const register = async (req: Request, res: Response) => {
  const user: IUser = await User.create({ ...req.body });
  const token: string = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user: IUser | null = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect: boolean = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token: string = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
