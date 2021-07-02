import { Types } from "mongoose";

import { FavoriteModel } from "../../../../models";

const pipeline = _id => [
  { $match: { candidat_uid: Types.ObjectId(_id) } },
  {
    $lookup: {
      from: "offers",
      as: "offer",
      localField: "offer_id",
      foreignField: "_id"
    }
  },
  { $unwind: "$offer" }
];

export default async (
  _,
  { offer_id },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  new Promise(async (resolve, reject) => {
    FavoriteModel.find({ candidat_uid: _id, offer_id: offer_id }).then(favs => {
      if (favs && favs.length > 0)
        reject("Cette offre fait déjà partie de vos offres sauvegardées");
      else {
        new FavoriteModel({
          candidat_uid: _id,
          offer_id: offer_id
        })
          .save()
          .then(() => {
            FavoriteModel.aggregate(pipeline(_id)).then(favorites => {
              resolve(favorites[0]);
            });
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
