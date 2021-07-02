import { model, Schema } from "mongoose";

const competenceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const CompetenceModel = model("competences", competenceSchema);
