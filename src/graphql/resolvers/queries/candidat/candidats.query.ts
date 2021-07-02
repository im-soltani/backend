import { CandidatModel } from "../../../../models";

const pipeline = (skip, limit) => [
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
  { $skip: skip ? skip : 0 },
  { $limit: limit ? limit : 5 }
];

const AllPipeline = () => [
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
  { $unwind: { path: "$cvs", preserveNullAndEmptyArrays: true } }
];

export default (_, { skip, limit }, {}) =>
  CandidatModel.aggregate(AllPipeline()).then(totals => {
    return CandidatModel.aggregate(pipeline(skip, limit)).then(candidats => {
      return {
        candidats: candidats,
        totalCount: candidats.length
      };
    });
  });
