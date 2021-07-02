"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
exports.default = (_, { id }) => models_1.UserModel.findById(id).then(user => {
    if (!user) {
        return user;
    }
    user.is_blocked = true;
    return user.save();
});
//# sourceMappingURL=block.user.mutation.js.map