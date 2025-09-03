import express, { Application } from "express";
import productsRouter from './routes/products'
import dotenv from "dotenv"
import "express-async-errors";
import connectDB from "./db/connect";
import notFoundMiddleware from "./middleware/not-found";
import errorMiddleware from "./middleware/error-handler";
import path from 'path'

// load env var
dotenv.config()
const app: Application = express()

// middleware
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// products route
app.use("/api/v1/products", productsRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    // connect to DB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not defined");

    await connectDB(mongoUri);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
};

start();
