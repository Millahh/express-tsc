import express, { Application } from 'express'
import tasks from './routes/tasks'
import connectDB from './db/connect'
import dotenv from 'dotenv';
import notFound from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handler'
import path from 'path'
// extra security packages
import helmet from 'helmet'
import cors from 'cors'
import xssClean from "xss-clean";
import rateLimit from 'express-rate-limit'

//Load env var
dotenv.config();
const app:Application = express()

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "blob:"],
      workerSrc: ["'self'", "blob:"],
    },
  })
);

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
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
 
// routes
app.use('/api/v1/tasks', tasks)
app.use(notFound)
app.use(errorHandlerMiddleware) 

const port = process.env.PORT || 3000

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
}

start()