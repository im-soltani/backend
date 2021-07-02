"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
const pipeline = [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" },
    { $lookup: { from: "rates", as: "rate_average", localField: "_id", foreignField: "entreprise_id" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id" } }
];
const pipelineWithDistance = (latitude, longitude) => [
    { $geoNear: { spherical: true, distanceField: "distance", /*maxDistance: 6000,*/ near: { type: String, default: "Point", coordinates: [parseFloat(latitude), parseFloat(longitude)] } } },
    ...pipeline
];
exports.default = (_, { latitude, longitude }, { user: { role } }) => models_1.EntrepriseModel.aggregate(latitude && longitude ? pipelineWithDistance(latitude, longitude) : pipeline).then(entreprises => entreprises.filter(entreprise => role == "ADMIN" || !entreprise.profile.is_blocked));
//# sourceMappingURL=entreprises.query.js.map