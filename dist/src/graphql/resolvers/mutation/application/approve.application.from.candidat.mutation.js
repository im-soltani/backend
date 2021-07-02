"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pubsub_1 = require("../../../pubsub");
const pipeline = (_id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $unwind: "$candidat" },
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$entreprise" },
    { $lookup: { from: "users", as: "candidat.profile", localField: "candidat.uid", foreignField: "_id" } },
    { $unwind: "$candidat.profile" },
    { $lookup: { from: "users", as: "entreprise.profile", localField: "entreprise.uid", foreignField: "_id" } },
    { $unwind: "$entreprise.profile" },
];
exports.default = (_, { id }) => models_1.ApplicationModel.findById(id).then(application => {
    if (!application) {
        return null;
    }
    application.state = "PAID";
    return application.save().then(application => models_1.ApplicationModel.aggregate(pipeline(application._id)).then(applications => {
        const application = applications[0];
        pubsub_1.default.publish("APPLICATION_UPDATED", { applicationUpdated: application });
        return application;
    }));
});
//# sourceMappingURL=approve.application.from.candidat.mutation.js.map