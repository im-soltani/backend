import {Types} from "mongoose";
import {CandidatModel} from "../../../../models";

const pipeline = (id) => [
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$lookup: {from: "applications", as: "applications", localField: "_id", foreignField: "candidat_id"}},
    {$lookup: {from: "conversations", as: "conversations", localField: "_id", foreignField: "candidat_id"}},
    {$lookup: {from: "cvs", as: "cvs", localField: "_id", foreignField: "uid"}},
    {$unwind: "$profile"},
    {$unwind: {path: "$cvs", preserveNullAndEmptyArrays: true}},
    {$match: {"profile._id": Types.ObjectId(id)}}
];

export default (_, __, {user: {_id}}) => CandidatModel.aggregate(pipeline(_id)).then(profiles => {
    return profiles.length ? profiles[0] : null;
});