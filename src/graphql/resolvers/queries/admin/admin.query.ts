import { Types } from "mongoose";
import { AdminModel } from "../../../../models";

const pipeline = filter => [
  { $match: filter },
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

export default (_, { num }, { user: { _id } }) => {
  const filter = num
    ? {
        num: num
      }
    : { uid: Types.ObjectId(_id) };
  return AdminModel.aggregate(pipeline(filter)).then(admins =>
    admins.length ? admins[0] : null
  );
};
