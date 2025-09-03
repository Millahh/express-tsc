import { Request, Response, NextFunction } from "express"

const errorHandlerMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

export default errorHandlerMiddleware