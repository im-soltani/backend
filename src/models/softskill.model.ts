import { model, Schema } from "mongoose";

const softskillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const SoftskillModel = model("softskill", softskillSchema);
