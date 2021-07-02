"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = {
    auth: (next, source, { roles }, { user }) => roles.includes(user.role) ? next() : new apollo_server_express_1.AuthenticationError("UnAuthorized")
};
//# sourceMappingURL=index.js.map