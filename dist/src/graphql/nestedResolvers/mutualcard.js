"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: (_) => _._id,
    url: (_) => `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}${_.url}`
};
//# sourceMappingURL=mutualcard.js.map