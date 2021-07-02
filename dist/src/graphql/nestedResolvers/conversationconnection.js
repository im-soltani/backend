"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    unreaded_messages_count: (_, __, { user: { profile: { _id } } }) => {
        let count = 0;
        _.map(conversation => {
            const lastMessage = conversation.last_message.reverse()[0];
            if (!lastMessage.seen_at && _id.toString() != lastMessage.sender_id.toString()) {
                count++;
            }
        });
        return count;
    },
    conversations: _ => _
};
//# sourceMappingURL=conversationconnection.js.map