const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://mila:FbqIoPyXhsWIWvlQ@cluster0.l6vp9rl.mongodb.net/TASK-MANAGER?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = (url) =>{
mongoose.connect(url)
}

module.exports = connectDB
