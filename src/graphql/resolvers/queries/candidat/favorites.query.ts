import { Types } from "mongoose";
import { FavoriteModel } from "../../../../models";

const pipeline = ({ _id, skip, limit }) => [
  { $match: { candidat_uid: Types.ObjectId(_id) } },
  { $sort: { createdAt: -1 } },
  { $skip: skip ? skip : 0 },
  { $limit: limit ? limit : 5 }
];

const AllPipeline = _id => [{ $match: { candidat_uid: Types.ObjectId(_id) } }];

export default (
  _,
  { skip, limit },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  FavoriteModel.aggregate(AllPipeline(_id)).then(totals => {
    return FavoriteModel.aggregate(pipeline({ _id, skip, limit })).then(
      favorites => {
        return {
          favorites: favorites,
          totalCount: totals.length
        };
      }
    );
  });
