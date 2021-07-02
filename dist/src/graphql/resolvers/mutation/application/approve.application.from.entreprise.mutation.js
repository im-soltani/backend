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
exports.default = (_, { id, to_pay }) => models_1.ApplicationModel.findById(id).then(application => {
    if (!application) {
        return null;
    }
    application.state = "APPROVED";
    application.to_pay = to_pay;
    return application.save().then(application => models_1.ApplicationModel.aggregate(pipeline(application._id)).then(applications => {
        const application = applications[0];
        /*
        const candidat = application.candidat;
        const entreprise = application.entreprise;
        switch ((application as any).delivery_mode) {
        case "FREE":
        mailer({
            template: "applicatione_click_collect_patient",
            footer: true,
            from: "applicationes@pharmaloop.fr",
            to: candidat.profile.email,
            subject: "Traitement de applicatione",
            vars: {
                first_name: candidat.first_name,
                last_name: candidat.last_name,
                name: entreprise.name,
                address: entreprise.address
            }
        });
        break;
    case "IN_DAY":

        mailer({
            template: "applicatione_fin_jour_encours_trait_patient",
            footer: true,
            from: "applicationes@pharmaloop.fr",
            to: candidat.profile.email,
            subject: "Traitement de applicatione",
            vars: {
                first_name: candidat.first_name,
                last_name: candidat.last_name,
                name: entreprise.name,
                address: entreprise.address,
                date: new Date((application as any).delivery_date).toLocaleDateString()

            }
        });
        break;
    case "EXPRESS":
        mailer({
            template: "applicatione_express_encours_trait_patient",
            footer: true,
            from: "applicationes@pharmaloop.fr",
            to: candidat.profile.email,
            subject: "Traitement de applicatione",
            vars: {
                first_name: candidat.first_name,
                last_name: candidat.last_name
            }
        });
        break;
}
Notification.sendToCandidat({
    userId: candidat.profile._id,
    body: `Votre applicatione n° ${(application as any).num} est maintenant en cours de traitement. Merci pour votre confiance.`,
    data: {id: application._id}
});
*/
        pubsub_1.default.publish("APPLICATION_UPDATED", { applicationUpdated: application });
        return application;
    }));
});
//# sourceMappingURL=approve.application.from.entreprise.mutation.js.map