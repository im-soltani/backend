import { CandidatModel } from "../../../../models";
import { Types } from "mongoose";
const pipeline = id => [
  { $match: { _id: Types.ObjectId(id) } },
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

export default (_, { id, isFavoris }, { user: { _id } }) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findById(id).then(candidat => {
      let entreprises = candidat.entreprises;
      if (
        entreprises.filter(entre => entre.id.toString() === _id.toString())
          .length > 0
      ) {
        entreprises.map(etr => {
          if (etr.id.toString() === _id.toString()) etr.isFavoris = isFavoris;
          return etr;
        });
      } else {
        let entre = {
          id: _id.toString(),
          sharedcv: false,
          isFavoris: isFavoris,
          img_url: "",
          mycv: true,
          recieved: false,
          rating: candidat.note,
          createdAt: new Date()
        };

        entreprises.push(entre);
      }

      candidat.entreprises = entreprises;
      return candidat.save().then(() => {
        CandidatModel.createMapping(function (err, mapping) {
          if (err) {
            console.log(err);
          } else {
            var stream = CandidatModel.synchronize();
            var count = 0;

            stream.on("data", function (err, doc) {
              count++;
            });
            stream.on("close", function () { });
            stream.on("error", function (err) {
              console.log(err);
            });
          }
        });
        return CandidatModel.aggregate(pipeline(id))
          .then(async candidats => {
            resolve(candidats[0]);
          })
          .catch(err => reject(err));
      });
    });
  });
