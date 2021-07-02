"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true, versionKey: false });
exports.AdminModel = mongoose_1.model("admins", adminSchema);
//# sourceMappingURL=admin.model.js.map