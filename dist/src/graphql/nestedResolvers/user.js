"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: (_) => _._id,
    profile_pic_url: (_) => !_.profile_pic_url ? _.profile_pic_url : `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}${_.profile_pic_url}`
};
//# sourceMappingURL=user.js.map