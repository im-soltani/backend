"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (id) => [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id" } },
    { $lookup: { from: "conversations", as: "conversations", localField: "_id", foreignField: "entreprise_id" } },
    { $unwind: "$profile" },
    { $match: { "profile._id": mongoose_1.Types.ObjectId(id) } }
];
exports.default = (_, __, { user: { _id } }) => models_1.EntrepriseModel.aggregate(pipeline(_id)).then(profiles => profiles[0]);
//# sourceMappingURL=profile.query.js.map