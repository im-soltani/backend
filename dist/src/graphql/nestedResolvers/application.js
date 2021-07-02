"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
exports.default = {
    id: (_) => _._id,
    candidat: (_) => models_1.CandidatModel.findById(_.candidat_id),
    entreprise: (_) => models_1.EntrepriseModel.findById(_.entreprise_id),
};
//# sourceMappingURL=application.js.map