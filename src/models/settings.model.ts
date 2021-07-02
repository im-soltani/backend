import { model, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    rgpd: {
      type: String,
      required: true,
    },
    legal: {
      type: String,
      required: true,
    },
    tutoriel: {
      type: String,
      required: true,
    },
    cgu: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const SettingsModel = model("settings", settingsSchema);
