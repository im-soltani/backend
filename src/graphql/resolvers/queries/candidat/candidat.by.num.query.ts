import { CandidatModel } from "../../../../models";

const pipeline = num => [
  { $match: { num: num } },
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

export default (_, { num }) => {
  return CandidatModel.aggregate(pipeline(num)).then(candidats => {
    return candidats[0];
  });
};
