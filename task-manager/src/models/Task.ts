import mongoose, { Document, Model} from "mongoose";

export interface ITask extends Document {
  name: string;
  completed: boolean;
}

const TaskSchema = new mongoose.Schema<ITask>({
  name: {
    type: String,
    required: [true, "must provide name" ],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters']
  },
  completed: {
    type:Boolean,
    default:false
  },
});

const Task:Model<ITask> = mongoose.model<ITask>("Task", TaskSchema)
export default Task;
