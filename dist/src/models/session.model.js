"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });
exports.SessionModel = mongoose_1.model("sessions", sessionSchema);
//# sourceMappingURL=session.model.js.map