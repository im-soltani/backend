import { Types } from "mongoose";
import {
  CandidatModel,
  UserModel,
  ApplicationModel,
  FavoriteModel
} from "../../../../models";

export default async (_, { id, email }, {}) =>
  new Promise(async (resolve, reject) => {
    ApplicationModel.find({
      candidat_id: Types.ObjectId(id)
    }).then(async apps => {
      await apps.map(app => app.remove());
    });
    FavoriteModel.find({ candidat_id: Types.ObjectId(id) }).then(async apps => {
      await apps.map(app => app.remove());
    });
    CandidatModel.findById(id).then(async app => {
      await app.remove();
    });
    UserModel.find({ email: email }).then(async users => {
      await users.map(app => app.remove());
    });
    CandidatModel.createMapping(function(err, mapping) {
      if (err) {
        console.log(err);
      } else {
        var stream = CandidatModel.synchronize();
        var count = 0;

        stream.on("data", function(err, doc) {
          count++;
        });
        stream.on("close", function() {});
        stream.on("error", function(err) {
          console.log(err);
        });
      }
    });
    resolve(true);
  });
