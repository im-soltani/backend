"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $lookup: { from: "vital_cards", as: "vital_card", localField: "_id", foreignField: "uid" } },
    { $unwind: { path: "$vital_card", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "mutual_cards", as: "mutual_card", localField: "_id", foreignField: "uid" } },
    { $unwind: { path: "$mutual_card", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "candidat_id" } },
];
exports.default = (_, { id }) => {
    return models_1.CandidatModel.aggregate(pipeline(id)).then(candidats => {
        return candidats[0];
    });
};
//# sourceMappingURL=candidat.query.js.map