import { CandidatModel } from "../../../../models";

export default (_, { state }, { user: { _id } }) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findOne({ uid: _id }).then(candidat => {
      if (!candidat) resolve(false);

      candidat.sharedcv = state;
      candidat.sharedby = "Candidatures spontanées";
      candidat.sharedAt = new Date();
      candidat.save().then(() => {
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
    });
  });
