import { Types } from "mongoose";
import { CandidatModel } from "../../../../models";

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
  { $unwind: "$profile" },
  {
    $lookup: { from: "cvs", as: "cvs", localField: "_id", foreignField: "uid" }
  },
  { $unwind: { path: "$cvs", preserveNullAndEmptyArrays: true } },

  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "candidat_id"
    }
  }
];

export default (_, { id }) => {
  return CandidatModel.aggregate(pipeline(id)).then(candidats => {
    return candidats[0];
  });
};
