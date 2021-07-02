"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
exports.default = (_, { id }) => models_1.ApplicationModel.findById(id).then(application => {
    if (!application) {
        return null;
    }
    application.renouvelable = false;
    return application.save();
});
//# sourceMappingURL=update.application.mutation.js.map