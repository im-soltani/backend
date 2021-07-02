import { Types } from "mongoose";
import { EntrepriseModel } from "../../../../models";

const pipeline = (id, role) => [
  { $match: { uid: role === "ADMIN" ? { $in: [id] } : Types.ObjectId(id) } },

  {
    $lookup: {
      from: "users",
      as: "profile",
      pipeline: [{ $match: { _id: Types.ObjectId(id) } }],
    }
  },
  { $unwind: "$profile" },
  {
    $lookup: {
      from: "users",
      as: "leaderProfile",
      localField: "uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$leaderProfile" },

  {
    $lookup: {
      from: "rates",
      as: "rate_average",
      localField: "_id",
      foreignField: "entreprise_id"
    }
  },
  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "entreprise_id"
    }
  }
];

export default (_, { }, { user: { _id, role } }) =>
  EntrepriseModel.aggregate(pipeline(_id, role)).then(entreprises => {
    if (!entreprises.length) {
      return null;
    }
    return entreprises[0];
  });
