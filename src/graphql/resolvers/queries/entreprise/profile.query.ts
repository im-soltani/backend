import {Types} from "mongoose";
import {EntrepriseModel} from "../../../../models";

const pipeline = (id) => [
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$lookup: {from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id"}},
    {$lookup: {from: "conversations", as: "conversations", localField: "_id", foreignField: "entreprise_id"}},
    {$unwind: "$profile"},
    {$match: {"profile._id": Types.ObjectId(id)}}
];

export default (_, __, {user: {_id}}) => EntrepriseModel.aggregate(pipeline(_id)).then(profiles => profiles[0]);