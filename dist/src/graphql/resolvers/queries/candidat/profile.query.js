"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (id) => [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "candidat_id" } },
    { $lookup: { from: "conversations", as: "conversations", localField: "_id", foreignField: "candidat_id" } },
    { $lookup: { from: "mutual_cards", as: "mutual_card", localField: "_id", foreignField: "uid" } },
    { $lookup: { from: "vital_cards", as: "vital_card", localField: "_id", foreignField: "uid" } },
    { $unwind: "$profile" },
    { $unwind: { path: "$mutual_card", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$vital_card", preserveNullAndEmptyArrays: true } },
    { $match: { "profile._id": mongoose_1.Types.ObjectId(id) } }
];
exports.default = (_, __, { user: { _id } }) => models_1.CandidatModel.aggregate(pipeline(_id)).then(profiles => {
    return profiles.length ? profiles[0] : null;
});
//# sourceMappingURL=profile.query.js.map