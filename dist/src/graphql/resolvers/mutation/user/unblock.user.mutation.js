"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
exports.default = (_, { id }) => models_1.UserModel.findById(id).then(user => {
    if (!user) {
        return user;
    }
    user.is_blocked = false;
    return user.save();
});
//# sourceMappingURL=unblock.user.mutation.js.map