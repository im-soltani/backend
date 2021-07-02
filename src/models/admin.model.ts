import { model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true
    },
    num: {
      type: Number,
      required: true,
      unique: true
    },
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    profile_pic_url: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
);

export const AdminModel = model("admins", adminSchema);
