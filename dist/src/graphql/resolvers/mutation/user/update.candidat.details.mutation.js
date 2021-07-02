"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (_id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { id, input: { first_name, last_name, address, tel } }, { user: { profile: { _id }, role } }) => models_1.CandidatModel.findById(role == "ADMIN" ? id : _id).then(candidat => {
    if (!candidat) {
        return null;
    }
    candidat.first_name = first_name;
    candidat.last_name = last_name;
    candidat.tel = tel;
    candidat.address = address;
    return candidat.save().then(candidat => models_1.CandidatModel.aggregate(pipeline(candidat.id)).then(candidats => candidats[0]));
});
//# sourceMappingURL=update.candidat.details.mutation.js.map