import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      name: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
