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

export default (_, { id, mycv }, { user: { _id } }) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findById(id).then(candidat => {
      let entreprises = candidat.entreprises;

      let entre = {
        id: _id.toString(),
        sharedcv: false,
        mycv: mycv,
        img_url: "",
        recieved: false,
        rating: candidat.note,
        createdAt: new Date()
      };

      entreprises.push(entre);

      candidat.entreprises = entreprises;
      return candidat.save().then(() => {
        return CandidatModel.aggregate(pipeline(id))
          .then(async candidats => {
            resolve(candidats[0]);
          })
          .catch(err => reject(err));
      });
    });
  });
