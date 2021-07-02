"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    candidat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entreprise_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    conversation_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ["TEXT", "IMAGE"],
        default: "TEXT"
    },
    seen_at: {
        type: Number
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });
exports.MessageModel = mongoose_1.model("messages", messageSchema);
//# sourceMappingURL=message.model.js.map