import express, { Application } from 'express';
import dotenv from "dotenv"
import 'express-async-errors';
import mainRouter from './routes/main';
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import path from 'path'
// extra security packages
import helmet from 'helmet'
import cors from 'cors'
import xssClean from "xss-clean";
import rateLimit from 'express-rate-limit'

dotenv.config()
const app: Application = express()

// extra security
app.set('trust proxy', 1)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xssClean());

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