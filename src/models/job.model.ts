import { model, Schema } from "mongoose";

const jobSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const JobModel = model("jobs", jobSchema);
