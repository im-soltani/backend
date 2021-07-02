import { Types } from "mongoose";
import { OfferModel, EntrepriseModel } from "../../../../models";

const pipeline = ({ _id, state, search, skip, limit, field, direction }) => {
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
      entreprise_id: Types.ObjectId(_id),
      state: state,
      $or: [{ name: search }, { city: search }]
    };
  } else {
    filter = {
      entreprise_id: Types.ObjectId(_id),
      state: state
    };
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
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "jobs",
        as: "job",
        localField: "job_id",
        foreignField: "_id"
      }
    },
    { $unwind: "$job" },
    { $sort: sort },
    { $skip: skip ? skip : 0 },
    { $limit: limit ? limit : 5 }
  ];
};

const AllPipeline = ({ _id, state, search }) => {
  let filter = {};
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");

    filter = {
      entreprise_id: Types.ObjectId(_id),
      state: state,
      $or: [{ name: search }, { city: search }]
    };
  } else {
    filter = {
      entreprise_id: Types.ObjectId(_id),
      state: state
    };
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
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "jobs",
        as: "job",
        localField: "job_id",
        foreignField: "_id"
      }
    },
    { $unwind: "$job" }
  ];
};

export default (_, { num, state, search, skip, limit, field, direction }, {}) =>
  EntrepriseModel.findOne({ num: num }).then(entreprise => {
    return OfferModel.aggregate([
      AllPipeline({
        _id: (entreprise as any)._id,
        state,
        search
      })
    ]).then(totals => {
      return OfferModel.aggregate([
        pipeline({
          _id: (entreprise as any)._id,
          state,
          search,
          skip,
          limit,
          field,
          direction
        })
      ]).then(offers => {
        return {
          offers: offers,
          totalCount: totals.length
        };
      });
    });
  });
