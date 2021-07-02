"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: (_) => _._id,
    last_message: (_) => !_.last_message.length ? null : _.last_message[0],
    messages: (_) => _.messages.reverse()
};
//# sourceMappingURL=conversation.js.map