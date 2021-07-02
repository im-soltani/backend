"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = require("../../../pubsub");
exports.default = {
    subscribe: graphql_subscriptions_1.withFilter(() => pubsub_1.default.asyncIterator("MESSAGE_SEEN"), (payload, variables) => {
        if (!payload || !variables) {
            return false;
        }
        return payload.messageReaded.candidat.profile._id.toString() == variables.id.toString()
            || payload.messageReaded.candidat._id.toString() == variables.id.toString()
            || payload.messageReaded.conversation_id.toString() == variables.id.toString();
    })
};
//# sourceMappingURL=message.readed.subscription.js.map