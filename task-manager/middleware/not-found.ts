import { Request, Response } from "express"

const notFound = (req: Request, res: Response) => res.status(404).send("Route doesnt exist")

export default notFound