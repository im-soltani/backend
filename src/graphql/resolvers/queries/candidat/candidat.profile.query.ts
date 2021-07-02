import { Types } from "mongoose";
import { CandidatModel } from "../../../../models";

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

export default (_, { }, { user: { _id } }) =>
  CandidatModel.aggregate(pipeline(_id)).then(candidats => {
    if (!candidats.length) {
      return null;
    }
    return candidats[0];
  });
