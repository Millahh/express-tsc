import { Schema, model, Types, Document } from "mongoose";

export interface IJob extends Document {
  company: string;
  position: string;
  status: "interview" | "declined" | "pending" | "accepted";
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position name"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending", "accepted"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default model<IJob>("Job", JobSchema);
