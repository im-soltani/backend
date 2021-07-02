import { Types } from "mongoose";
import { OfferModel } from "../../../../models";

const pipeline = ({ _id, role, skip, limit }) => {
  switch (role) {
    case "ENTREPRISE":
      return [
        { $match: { entreprise_id: Types.ObjectId(_id) } },
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
        { $skip: skip ? skip : 0 },
        { $limit: limit ? limit : 5 }
      ];
    default:
      return [
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
        { $skip: skip ? skip : 0 },
        { $limit: limit ? limit : 5 }
      ];
  }
};

const AllPipeline = ({ _id, role }) => {
  switch (role) {
    case "ENTREPRISE":
      return [
        { $match: { entreprise_id: Types.ObjectId(_id) } },
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
    default:
      return [
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
  }
};

export default (
  _,
  { skip, limit },
  {
    user: {
      role,
      profile: { _id }
    }
  }
) =>
  OfferModel.aggregate([
    AllPipeline({
      _id,
      role
    })
  ]).then(totals => {
    return OfferModel.aggregate([
      pipeline({
        _id,
        role,
        skip,
        limit
      })
    ]).then(offers => {
      return {
        offers: offers.filter(offer => offer.state !== "DELETED"),
        totalCount: totals.length
      };
    });
  });
