"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
const pipeline = [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $lookup: { from: "vital_cards", as: "vital_card", localField: "_id", foreignField: "uid" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "candidat_id" } },
    { $unwind: { path: "$vital_card", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "mutual_cards", as: "mutual_card", localField: "_id", foreignField: "uid" } },
    { $unwind: { path: "$mutual_card", preserveNullAndEmptyArrays: true } }
];
exports.default = () => models_1.CandidatModel.aggregate(pipeline);
//# sourceMappingURL=candidats.query.js.map