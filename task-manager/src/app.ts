import express, { Application } from 'express'
import tasks from './routes/tasks'
import connectDB from './db/connect'
import dotenv from 'dotenv';
import notFound from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handler'
import path from 'path'

//Load env var
dotenv.config();

const app:Application = express()

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