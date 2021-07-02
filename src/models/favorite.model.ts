import { model, Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    candidat_uid: {
      type: Schema.Types.ObjectId,
      required: true
    },
    offer_id: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const FavoriteModel = model("favorites", favoriteSchema);
