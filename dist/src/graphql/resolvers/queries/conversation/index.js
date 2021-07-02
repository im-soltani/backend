"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_query_1 = require("./conversation.query");
const conversations_query_1 = require("./conversations.query");
exports.default = {
    getConversations: conversations_query_1.default,
    getConversation: conversation_query_1.default,
};
//# sourceMappingURL=index.js.map