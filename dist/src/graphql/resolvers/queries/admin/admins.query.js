"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (id) => [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $match: { "profile._id": { $ne: mongoose_1.Types.ObjectId(id) } } },
];
exports.default = (_, __, { user: { _id } }) => models_1.AdminModel.aggregate(pipeline(_id));
//# sourceMappingURL=admins.query.js.map