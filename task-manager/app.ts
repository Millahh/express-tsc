import express, { Application } from 'express'
import tasks from './routes/tasks'
import connectDB from './db/connect'
import dotenv from 'dotenv';
import notFound from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handler'

//Load env vars
dotenv.config();

const app:Application = express()

// middleware
app.use(express.static('./public'))
app.use(express.json())
 
// routes
app.use('/api/v1/tasks', tasks)
app.use(notFound)
app.use(errorHandlerMiddleware) 

const port = process.env.PORT || 3000

const start = async (): Promise<void> => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}`)) 
    } catch (error) {
        console.log(error)
    }
}

start()