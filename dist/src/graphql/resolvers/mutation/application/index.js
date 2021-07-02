"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_application_mutation_1 = require("./add.application.mutation");
const approve_application_from_candidat_mutation_1 = require("./approve.application.from.candidat.mutation");
const approve_application_from_entreprise_mutation_1 = require("./approve.application.from.entreprise.mutation");
const reject_application_from_entreprise_mutation_1 = require("./reject.application.from.entreprise.mutation");
const remove_application_from_candidat_mutation_1 = require("./remove.application.from.candidat.mutation");
const update_application_mutation_1 = require("./update.application.mutation");
exports.default = {
    addApplication: add_application_mutation_1.default,
    approveApplicationFromCandidat: approve_application_from_candidat_mutation_1.default,
    approveApplicationFromEntreprise: approve_application_from_entreprise_mutation_1.default,
    revokeApplicationFromCandidat: remove_application_from_candidat_mutation_1.default,
    rejectApplicationFromEntreprise: reject_application_from_entreprise_mutation_1.default,
    updateApplication: update_application_mutation_1.default
};
//# sourceMappingURL=index.js.map