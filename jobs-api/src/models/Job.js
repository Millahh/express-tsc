const { types } = require("joi");
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending", "accepted"],
      default: "pending",
    },
    createdBy: {
      // used as a referencee (FK) to User collection
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  // create createdAt and updatedAt properties
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
