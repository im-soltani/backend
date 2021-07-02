"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_query_1 = require("./application.query");
const applications_query_1 = require("./applications.query");
const applicationsByCritere_1 = require("./applicationsByCritere");
exports.default = {
    getApplication: application_query_1.default,
    getApplications: applications_query_1.default,
    getApplicationsByCritere: applicationsByCritere_1.default
};
//# sourceMappingURL=index.js.map