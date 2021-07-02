import {Types} from "mongoose";
import {AdminModel} from "../../../../models";

const pipeline = (id) => [
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$unwind: "$profile"},
    {$match: {"profile._id": Types.ObjectId(id)}}
];

export default (_, __, {user: {_id}}) => AdminModel.aggregate(pipeline(_id)).then(profiles => profiles.length ? profiles[0] : null);