import {
  CandidatModel,
  UserModel,
  EntrepriseModel,
  OfferModel
} from "../../../../models";

export default (_, { type, status }) =>
  UserModel.updateMany(
    { ref: type },
    { $set: { is_blocked_by_admin: status } }
  ).then(user => {
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
    EntrepriseModel.createMapping(function(err, mapping) {
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
    if (!user) {
      return false;
    } else return true;
  });
