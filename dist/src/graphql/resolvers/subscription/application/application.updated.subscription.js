"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = require("../../../pubsub");
exports.default = {
    subscribe: graphql_subscriptions_1.withFilter(() => pubsub_1.default.asyncIterator("APPLICATION_UPDATED"), (payload, variables) => {
        if (!variables && !payload) {
            return false;
        }
        const { id, candidat_id, entreprise_id } = variables;
        const { applicationUpdated } = payload;
        if (!applicationUpdated) {
            return false;
        }
        if (!id && !candidat_id && !entreprise_id) {
            return false;
        }
        if (id) {
            return applicationUpdated._id.toString() == id.toString();
        }
        else if (candidat_id) {
            return applicationUpdated.candidat.profile._id.toString() == candidat_id.toString();
        }
        else if (entreprise_id) {
            return applicationUpdated.entreprise.profile._id.toString() == entreprise_id.toString();
        }
        return false;
    })
};
//# sourceMappingURL=application.updated.subscription.js.map