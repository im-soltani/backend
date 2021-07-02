import { Types } from "mongoose";
import { OfferModel } from "../../../../models";

const pipeline = ({
  _id,
  role,
  state,
  search,
  skip,
  limit,
  field,
  direction,
  ent_type,
  offreType,
}) => {
  let sort = {};
  if (field && direction) {
    if (field === "name") {
      sort = { name: direction };
    } else if (field === "createdAt") {
      sort = { createdAt: direction };
    }
  } else {
    sort = { createdAt: -1 };
  }
  let filter = {};
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
    if (role === "ENTREPRISE") {
      filter = {
        entreprise_id: Types.ObjectId(_id),
        state: state,
        $or: [{ name: search }, { city: search }],
      };
    } else {
      if (offreType == "EDUCATION") {
        filter = {
          state: state,
          offreType: offreType,
          $or: [{ name: search }],
        };
      } else
        filter = {
          state: state,
          offreType: offreType,
          $or: [{ name: search }, { city: search }],
        };
    }
  } else {
    if (role === "ENTREPRISE") {
      filter = {
        entreprise_id: Types.ObjectId(_id),
        state: state,
      };
    } else {
      filter = {
        offreType: offreType,
        state: state,
      };
    }
  }
  switch (role) {
    case "ENTREPRISE":
      if (ent_type == "ecole")
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
      else
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

          {
            $lookup: {
              from: "jobs",
              as: "job",
              localField: "job_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$job" },
          { $sort: sort },
          { $skip: skip ? skip : 0 },
          { $limit: limit ? limit : 5 },
        ];
    default:
      if (offreType != "EDUCATION")
        return [
          { $match: filter },
          {
            $lookup: {
              from: "entreprises",
              as: "entreprise",
              localField: "entreprise_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$entreprise" },

          {
            $lookup: {
              from: "jobs",
              as: "job",
              localField: "job_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$job" },
          { $sort: sort },
          { $skip: skip ? skip : 0 },
          { $limit: limit ? limit : 5 },
        ];
      else
        return [
          { $match: filter },
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
  }
};

const AllPipeline = ({ _id, role, state, ent_type, offreType }) => {
  let filter = {};
  if (role === "ENTREPRISE") {
    filter = {
      entreprise_id: Types.ObjectId(_id),
      state: state,
    };
  } else {
    filter = {
      offreType: offreType == "JOB" ? "JOB" : "EDUCATION",
      state: state,
    };
  }
  switch (role) {
    case "ENTREPRISE":
      if (ent_type == "ecole")
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
          { $sort: { createdAt: -1 } },
        ];
      else
        return [
          {
            $match: filter,
          },
        ];
    default:
      if (offreType == "JOB")
        return [
          { $match: filter },
          {
            $lookup: {
              from: "entreprises",
              as: "entreprise",
              localField: "entreprise_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$entreprise" },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "jobs",
              as: "job",
              localField: "job_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$job" },
        ];
      else
        return [
          { $match: filter },
          {
            $lookup: {
              from: "entreprises",
              as: "entreprise",
              localField: "entreprise_id",
              foreignField: "_id",
            },
          },
          { $unwind: "$entreprise" },
        ];
  }
};

export default (
  _,
  { state, search, skip, limit, field, direction, ent_type, offreType },
  {
    user: {
      role,
      profile: { _id },
    },
  }
) =>
  OfferModel.aggregate([
    AllPipeline({
      _id,
      role,
      state,
      ent_type,
      offreType,
    }),
  ]).then((totals) => {
    console.log("totals", totals.length);
    return OfferModel.aggregate([
      pipeline({
        _id,
        role,
        state,
        search,
        skip,
        limit,
        field,
        direction,
        ent_type,
        offreType,
      }),
    ]).then((offers) => {
      return {
        offers: offers,
        totalCount: totals.length,
      };
    });
  });
