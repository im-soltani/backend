import { EntrepriseModel } from "../../../../models";

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
  { $unwind: "$profile" },
  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "entreprise_id"
    }
  },
  {
    $lookup: {
      from: "users",
      as: "userrs",
      localField: "uid",
      foreignField: "_id"
    }
  },

];

export default (_, { num }, { user: { role } }) =>
  EntrepriseModel.aggregate(pipeline(num)).then(entreprises => {
    if (!entreprises.length) {
      return null;
    }
    if (entreprises[0].profile.is_blocked && role != "ADMIN") {
      return null;
    }
    return entreprises[0];
  });
