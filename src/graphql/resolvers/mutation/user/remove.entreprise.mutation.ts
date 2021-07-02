import { Types } from "mongoose";
import {
  EntrepriseModel,
  UserModel,
  OfferModel,
  CandidatModel,
  ApplicationModel,
  FavoriteModel
} from "../../../../models";

export default async (_, { id, email }, {}) =>
  new Promise(async (resolve, reject) => {
    ApplicationModel.find({
      entreprise_id: Types.ObjectId(id)
    }).then(async apps => {
      await apps.map(app => app.remove());
    });

    OfferModel.find({ entreprise_id: Types.ObjectId(id) }).then(
      async offers => {
        await offers.map(async offer => {
          FavoriteModel.find({ offer_id: Types.ObjectId(offer._id) }).then(
            async apps => {
              await apps.map(app => app.remove());
            }
          );
          await offer.remove();
        });
      }
    );

    EntrepriseModel.findById(id).then(async app => {
      await CandidatModel.find({
        entreprises: { $elemMatch: { id: Types.ObjectId(app.uid[0]) } }
      }).then(async candidats => {
        await candidats.map(async candidat => {
          candidat.entreprises = candidat.entreprises.filter(
            fil => fil.id.toString() !== app.uid[0].toString()
          );
          await candidat.save();
        });
      });
      await app.remove();
    });
    UserModel.find({ email: email }).then(async users => {
      await users.map(app => app.remove());
    });
    EntrepriseModel.createMapping(function(err, mapping) {
      if (err) {
        console.log(err);
      } else {
        var stream = EntrepriseModel.synchronize();
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
