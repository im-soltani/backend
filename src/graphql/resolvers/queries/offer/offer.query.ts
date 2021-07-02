import { Types } from "mongoose";
import { OfferModel } from "../../../../models";

const filter = [
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

const pipeline = ({ id, _id, role }) => {
  switch (role) {
    case "ENTRPRISE":
      return [
        {
          $match: {
            _id: Types.ObjectId(id),
            entreprise_id: Types.ObjectId(_id)
          }
        },
        ...filter
      ];
    default:
      return [{ $match: { _id: Types.ObjectId(id) } }, ...filter];
  }
};

export default async (
  _,
  { id },
  {
    user: {
      role,
      profile: { _id }
    }
  }
) =>
  OfferModel.aggregate(
    pipeline({
      id,
      _id,
      role
    })
  ).then(applications => applications[0]);
