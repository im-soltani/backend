"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = require("../../../pubsub");
exports.default = {
    subscribe: graphql_subscriptions_1.withFilter(() => pubsub_1.default.asyncIterator("APPLICATION_ADDED"), (payload, variables) => {
        if (!variables && !payload) {
            return false;
        }
        const { id, candidat_id, entreprise_id } = variables;
        const { applicationAdded } = payload;
        if (!applicationAdded) {
            return false;
        }
        if (!id && !candidat_id && !entreprise_id) {
            return false;
        }
        if (id) {
            return applicationAdded._id.toString() == id.toString();
        }
        else if (candidat_id) {
            return applicationAdded.candidat.profile._id.toString() == candidat_id.toString();
        }
        else if (entreprise_id) {
            return applicationAdded.entreprise.profile._id.toString() == entreprise_id.toString();
        }
        return false;
    })
};
//# sourceMappingURL=application.added.subscription.js.map