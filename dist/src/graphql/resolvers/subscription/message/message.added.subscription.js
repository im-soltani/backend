"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = require("../../../pubsub");
exports.default = {
    subscribe: graphql_subscriptions_1.withFilter(() => pubsub_1.default.asyncIterator("MESSAGE_ADDED"), (payload, variables) => {
        if (!payload || !variables) {
            return false;
        }
        return payload.messageAdded.candidat.profile._id.toString() == variables.id.toString()
            || payload.messageAdded.candidat._id.toString() == variables.id.toString()
            || payload.messageAdded.entreprise.profile._id.toString() == variables.id.toString()
            || payload.messageAdded.entreprise._id.toString() == variables.id.toString();
    })
};
//# sourceMappingURL=message.added.subscription.js.map