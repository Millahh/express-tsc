import express, { Application } from 'express'
import dotenv from 'dotenv'
import 'express-async-errors';

// extra security packages
import helmet from 'helmet'
import cors from 'cors'
import xssClean from "xss-clean";
import rateLimit from 'express-rate-limit'

// connectDB
import connectDB from './db/connect'
import authenticateUser from './middleware/authentication'

// routers
import authRouter from './routes/auth'
import jobsRouter from './routes/jobs'

// error handler
import notFoundMiddleware from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handler'

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

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) throw new Error("MONGO_URI is not defined")

    await connectDB(mongoUri)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message)
    else console.log(error);
  }
};

start();
