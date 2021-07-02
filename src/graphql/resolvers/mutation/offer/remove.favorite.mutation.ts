import { Types } from "mongoose";

import { FavoriteModel } from "../../../../models";

export default async (
  _,
  { id },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  new Promise(async (resolve, reject) => {
    FavoriteModel.deleteOne({ _id: id }).then(rest => {
      resolve(rest);
    });
  });
