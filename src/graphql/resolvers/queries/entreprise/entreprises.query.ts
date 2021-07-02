import { EntrepriseModel } from "../../../../models";

const pipeline = (filter, skip, limit, ent_type) => [
  { $match: filter },
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
      $and: [{ "profile.ref": { $ne: "admins" } }, { ent_type: ent_type }],
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
  { $skip: skip ? skip : 0 },
  { $limit: limit ? limit : 5 },
];
const pipelineAll = (filter, ent_type) => [
  { $match: filter },
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
      $and: [{ "profile.ref": { $ne: "admins" } }, { ent_type: ent_type }],
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
const removeDuplicates = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};
export default (_, { search, skip, limit, ent_type }, { user: { role } }) => {
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
  }
  const filter = search
    ? {
        $or: [{ name: search }],
      }
    : {};

  return EntrepriseModel.aggregate(pipelineAll(filter, ent_type)).then(
    (totals) => {
      return EntrepriseModel.aggregate(
        pipeline(filter, skip, limit, ent_type)
      ).then((entreprises) => {
        let data = removeDuplicates(totals, "num");
        return {
          entreprises: removeDuplicates(entreprises, "num"),
          totalCount: data.length
        };
      });
    }
  );
};
