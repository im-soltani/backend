import { Types } from "mongoose";
import { ApplicationModel } from "../../../../models";

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
  {
    $lookup: {
      from: "candidats",
      as: "candidat",
      localField: "candidat_id",
      foreignField: "_id"
    }
  },
  { $unwind: "$candidat" },
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "candidat.uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$candidat.profile" },
  {
    $lookup: {
      from: "offers",
      as: "offer",
      localField: "offer_id",
      foreignField: "_id"
    }
  },
  { $unwind: "$offer" }
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
    case "CANDIDAT":
      return [
        {
          $match: { _id: Types.ObjectId(id), candidat_id: Types.ObjectId(_id) }
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
  ApplicationModel.aggregate(
    pipeline({
      id,
      _id,
      role
    })
  ).then(applications => applications[0]);
