"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    candidat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entreprise_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
}, { timestamps: true, versionKey: false });
exports.ConversationModel = mongoose_1.model("conversations", conversationSchema);
//# sourceMappingURL=conversation.model.js.map