"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const mutation_1 = require("./mutation");
const queries_1 = require("./queries");
const subscription_1 = require("./subscription");
const nestedResolvers_1 = require("../nestedResolvers");
exports.default = Object.assign({ Query: queries_1.default,
    Mutation: mutation_1.default,
    Subscription: subscription_1.default, Upload: apollo_server_express_1.GraphQLUpload }, nestedResolvers_1.default);
//# sourceMappingURL=index.js.map