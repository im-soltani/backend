"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const instance = new graphql_subscriptions_1.PubSub();
instance.ee.setMaxListeners(10e1000000);
exports.default = instance;
//# sourceMappingURL=index.js.map