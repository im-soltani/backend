import { CandidatModel } from "../../../../models";
import { Types } from "mongoose";
const pipeline = id => [
  { $match: { uid: Types.ObjectId(id) } },
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$profile" }
];

export default (_, {}, { user: { _id, role } }) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findOne({ uid: Types.ObjectId(_id) }).then(
      candidat => {
        candidat.sharedby = "Partagés par les adhérents";
        candidat.sharedcv = true;
        candidat.sharedAt = new Date();
        candidat.save().then(() => {
          CandidatModel.createMapping(function(err, mapping) {
            if (err) {
              console.log("error creating mapping (you can safely ignore this)");
              console.log(err);
            } else {
              console.log("mapping created!");
          
              var stream = CandidatModel.synchronize();
              var count = 0;
          
              stream.on("data", function(err, doc) {
                count++;
              });
              stream.on("close", function() {
                console.log("[ElasticSearch] Indexed " + count + " " + " documents!");
              });
              stream.on("error", function(err) {
                console.log("mongoosastic ERROR");
                console.log(err);
              });
            }
          });
          CandidatModel.aggregate(pipeline(_id))
            .then(async candidats => {
              resolve(candidats[0]);
            })
            .catch(err => reject(err));
        });
      }
    );
  });
