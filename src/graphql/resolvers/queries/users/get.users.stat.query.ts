import { EntrepriseModel, UserModel } from "../../../../models";

const pipelineAll = () => [
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$profile" },
  {
    $match: {
      $and: [{ "profile.ref": { $ne: "admins" } }],
    },
  },

  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "entreprise_id",
    },
  },
];
export default (_, __, { user: {} }) =>
  UserModel.find({
    is_blocked: false,
    is_blocked_by_admin: false,
    ref: "candidats",
  }).then((candidats) => {
    return EntrepriseModel.aggregate(pipelineAll()).then((entreprises) => {
      return [candidats.length, entreprises.length];
    });
  });
