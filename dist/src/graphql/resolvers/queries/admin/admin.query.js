"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (adminId, viewerId) => ([
    { $match: { _id: mongoose_1.Types.ObjectId(adminId) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $match: { "profile._id": { $ne: mongoose_1.Types.ObjectId(viewerId) } } }
]);
exports.default = (_, { id }, { user: { _id } }) => models_1.AdminModel.aggregate(pipeline(id, _id)).then(admins => admins.length ? admins[0] : null);
//# sourceMappingURL=admin.query.js.map