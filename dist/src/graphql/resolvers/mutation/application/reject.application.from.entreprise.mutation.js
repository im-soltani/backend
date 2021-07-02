"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mailer_1 = require("../../../../../common/mailer");
const models_1 = require("../../../../models");
const utils_1 = require("../../../../tools/utils");
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
exports.default = (_, { id, rejectDescription }) => models_1.ApplicationModel.findById(id).then(application => {
    if (!application) {
        return null;
    }
    application.state = "REVOKED";
    application.to_pay = null;
    if (rejectDescription) {
        application.reject_description = rejectDescription;
    }
    return application.save().then(application => models_1.ApplicationModel.aggregate(pipeline(application._id)).then(applications => {
        const application = applications[0];
        const candidat = application.candidat;
        const entreprise = application.entreprise;
        mailer_1.default({
            template: "rejecter_applicatione",
            footer: true,
            from: "applicationes@pharmaloop.fr",
            to: candidat.profile.email,
            subject: "Applicatione rejetée",
            vars: {
                first_name: utils_1.capitalizeFirstLetter(candidat.first_name),
                last_name: utils_1.capitalizeFirstLetter(candidat.last_name),
                num: application.num,
                name: entreprise.name,
                reason: rejectDescription ? rejectDescription : "Pas de raison"
            }
        });
        pubsub_1.default.publish("APPLICATION_UPDATED", { applicationUpdated: application });
        return application;
    }));
});
//# sourceMappingURL=reject.application.from.entreprise.mutation.js.map