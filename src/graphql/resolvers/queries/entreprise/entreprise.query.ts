import { Types } from "mongoose";
import {EntrepriseModel} from "../../../../models";

const pipeline = id => [
    {$match: {_id: Types.ObjectId(id)}},
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$unwind: "$profile"},
    {$lookup: {from: "rates", as: "rate_average", localField: "_id", foreignField: "entreprise_id"}},
    {$lookup: {from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id"}},
];

export default (_, {id}, {user: {role}}) => EntrepriseModel.aggregate(pipeline(id)).then(entreprises => {
    if (!entreprises.length) {
        return null;
    }
    if (entreprises[0].profile.is_blocked && role != "ADMIN") {
        return null;
    }
    return entreprises[0];
});