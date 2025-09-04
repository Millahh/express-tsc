import express, { Application } from 'express';
import dotenv from "dotenv"
import 'express-async-errors';
import mainRouter from './routes/main';
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import path from 'path'

dotenv.config()
const app: Application = express()

// middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use('/api/v1', mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message)
    else console.log(error);
  }
};

start();