import { AdminModel } from "../../../../models";

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
  { $unwind: "$profile" }
];
export default (_, { skip, limit }, { user: { _id } }) =>
  AdminModel.aggregate(AllPipeline()).then(totals => {
    return AdminModel.aggregate(pipeline(skip, limit)).then(admins => {
      return {
        admins: admins,
        totalCount: totals.length
      };
    });
  });
