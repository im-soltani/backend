import { model, Schema } from "mongoose";

const emailSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    template: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    entreprise_uid: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const EmailModel = model("emails", emailSchema);
