import { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    num: {
      type: Number,
      required: true,
      unique: true
    },
    candidat_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    entreprise_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    offer_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    description: {
      type: String
    },
    experience: {
      type: String
    },
    profile: {
      type: String
    },
    disponibility: {
      type: Date
    },
    state: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "CANCELED",
        "REFUSED"
      ],
      default: "PENDING"
    },
    revoke_description: {
      type: String
    },
    reject_description: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
);

export const ApplicationModel = model("applications", applicationSchema);
