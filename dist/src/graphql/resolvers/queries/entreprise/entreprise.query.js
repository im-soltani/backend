"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = id => [
    { $match: { _id: mongoose_1.Types.ObjectId(id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $lookup: { from: "rates", as: "rate_average", localField: "_id", foreignField: "entreprise_id" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id" } },
];
exports.default = (_, { id }, { user: { role } }) => models_1.EntrepriseModel.aggregate(pipeline(id)).then(entreprises => {
    if (!entreprises.length) {
        return null;
    }
    if (entreprises[0].profile.is_blocked && role != "ADMIN") {
        return null;
    }
    return entreprises[0];
});
//# sourceMappingURL=entreprise.query.js.map