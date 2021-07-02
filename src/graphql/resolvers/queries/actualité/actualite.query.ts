import { Types } from "mongoose";
import { ActualiteModel } from "../../../../models";
const pipeline = ({
  _id,
  role,
  search,
  entreprise_id,
  allActus,
  skip,
  limit,
}) => {
  let sort = { createdAt: -1 };
  let filter = {};
  if (role === "ENTREPRISE") {
    if (allActus == "false") {
      filter = { entreprise_id: Types.ObjectId(_id) };
    } else {
      filter = {
        visibleToAdherent: true,
        startPublication: {
          $lte: new Date(),
        },
        endPublication: {
          $gte: new Date(),
        },
      };
    }
  } else if (role === "ADMIN") {
    filter = {
      startPublication: {
        $lte: new Date(),
      },
      endPublication: {
        $gte: new Date(),
      },
    };
  } else {
    filter = {
      entreprise_id: Types.ObjectId(entreprise_id),
      visibleToCandidat: true,
      startPublication: {
        $lte: new Date(),
      },
      endPublication: {
        $gte: new Date(),
      },
    };
  }
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
    filter["$or"] = [{ title: search }];
  }
  return [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "entreprises",
        as: "entreprise",
        localField: "entreprise_id",
        foreignField: "_id",
      },
    },
    { $unwind: "$entreprise" },
    { $sort: sort },
    { $skip: skip ? skip : 0 },
    { $limit: limit ? limit : 5 },
  ];
};

export default (
  _,
  { search, skip, limit, allActus, entreprise_id },
  {
    user: {
      role,
      profile: { _id, ent_type },
    },
  }
) =>
  ActualiteModel.aggregate([
    pipeline({
      _id,
      allActus,
      entreprise_id,
      role,
      search,
      skip,
      limit,
    }),
  ]).then((actualite) => {
    return {
      ActualiteResult: actualite,
      totalCount: actualite.length,
    };
  });
