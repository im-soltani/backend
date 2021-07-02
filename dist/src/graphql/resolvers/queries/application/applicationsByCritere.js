"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = ({ _id, role }) => {
    switch (role) {
        case "PHARMACY":
            return [
                { $match: { entreprise_id: mongoose_1.Types.ObjectId(_id) } },
                { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
                { $unwind: "$entreprise" },
                { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
                { $unwind: "$candidat" }
            ];
        case "CLIENT":
            return [
                { $match: { candidat_id: mongoose_1.Types.ObjectId(_id) } },
                { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
                { $unwind: "$candidat" },
                { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
                { $unwind: "$entreprise" }
            ];
        default:
            return [
                { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
                { $unwind: "$candidat" },
                { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
                { $unwind: "$entreprise" }
            ];
    }
};
exports.default = (_, __, { user: { role, profile: { _id } } }) => models_1.ApplicationModel.aggregate([pipeline({
        _id,
        role
    })]).sort({ createdAt: -1 }).then(applications => {
    return applications.filter(application => application.renouvelable == true && application.echanceDate == "true");
});
//# sourceMappingURL=applicationsByCritere.js.map