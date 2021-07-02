"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
exports.default = (_, { address }, { user: { profile: { _id } } }) => models_1.CandidatModel.findById(_id).then(candidat => {
    if (!candidat) {
        return false;
    }
    else {
        candidat.address = address;
        return candidat.save().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }
});
//# sourceMappingURL=change.candidat.address.mutation.js.map