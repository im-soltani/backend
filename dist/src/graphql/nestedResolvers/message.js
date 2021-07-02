"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const mongoose_1 = require("mongoose");
exports.default = {
    id: (_) => _._id,
    is_viewer_sender: (_, __, { user: { profile: { _id } } }) => _.sender_id.toString() == _id.toString(),
    is_seen: (_) => _.seen_at != null,
    candidat: (_) => models_1.CandidatModel.aggregate([{ $match: { _id: mongoose_1.Types.ObjectId(_.candidat_id) } }, {
            $lookup: {
                from: "users",
                as: "profile",
                localField: "uid",
                foreignField: "_id"
            }
        }, { $unwind: "$profile" }]).then(candidat => candidat[0]),
    entreprise: (_) => models_1.EntrepriseModel.aggregate([{ $match: { _id: mongoose_1.Types.ObjectId(_.entreprise_id) } }, {
            $lookup: {
                from: "users",
                as: "profile",
                localField: "uid",
                foreignField: "_id"
            }
        }, { $unwind: "$profile" }]).then(entreprise => entreprise[0])
};
//# sourceMappingURL=message.js.map