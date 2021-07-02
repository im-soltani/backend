import { OfferModel } from "../../../../models";

const pipeline = ({
  search,
  skip,
  limit,
  field,
  direction,
  field2,
  direction2,
  field3,
  direction3
}) => {
  let sort = {};
  if (field && direction) {
    if (field === "name") {
      sort = { name: direction };
    } else if (field === "createdAt") {
      sort = { createdAt: direction };
    }
  } else {
    sort = { name: 1 };
  }
  let filter = {};
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
    filter = {
      state: "PUBLISHED",
      offreType: "EDUCATION",
      $or: [{ name: search }, { city: search }]
    };
  } else {
    filter = {
      state: "PUBLISHED",
      offreType: "EDUCATION",
    };
  }
  if (field2 && direction2 && direction2 != 1) {
    filter["typeFormation"] = field2;
  }
  if (field3 && direction3 && direction3 != 1) {
    filter["dureeFormation"] = field3;
  }
  return [
    {
      $match: filter
    },
    {
      $lookup: {
        from: "entreprises",
        as: "entreprise",
        localField: "entreprise_id",
        foreignField: "_id"
      }
    },
    { $unwind: "$entreprise" },
    { $sort: sort },
    { $skip: skip ? skip : 0 },
    { $limit: limit ? limit : 5 }
  ];
};


export default (
  _,
  { search, skip, limit, field, direction, field2, direction2, field3, direction3 },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  OfferModel.aggregate([
    pipeline({
      search,
      skip,
      limit,
      field,
      direction,
      field2,
      direction2,
      field3,
      direction3
    })
  ]).then(offers => {
    return {
      offers: offers,
      totalCount: offers.length
    };
  });
