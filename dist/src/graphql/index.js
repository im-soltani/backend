"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const directiveResolvers_1 = require("./directiveResolvers");
const resolvers_1 = require("./resolvers");
const typeDefs_1 = require("./typeDefs");
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
    directiveResolvers: directiveResolvers_1.default,
    logger: {
        log: message => {
            // console.log("Logger: ", message);
        }
    }
});
//# sourceMappingURL=index.js.map