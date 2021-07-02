import { OfferModel } from "../../../../models";
import { EntrepriseModel } from "../../../../models/entreprise.model";

export default (_, { state }, { user: { _id } }) => {
  return EntrepriseModel.findOne({ uid: _id }).then(entre => {
    const filter =
      state === "ON_HOLD"
        ? { entreprise_id: entre._id, state: "PUBLISHED" }
        : state === "ARCHIVED"
        ? { entreprise_id: entre._id, state: { $nin: ["DELETED"] } }
        : { entreprise_id: entre._id };
    return OfferModel.updateMany(filter, { $set: { state: state } }).then(
      async offers => {
        OfferModel.createMapping(function(err, mapping) {
          if (err) {
            console.log(err);
          } else {
            var stream = OfferModel.synchronize();
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
        if (!offers) {
          return false;
        } else {
          return true;
        }
      }
    );
  });
};
