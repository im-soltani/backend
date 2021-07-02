"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vitalCardSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    url: String
}, { timestamps: true, versionKey: false });
exports.VitalCardModel = mongoose_1.model("vital_cards", vitalCardSchema);
//# sourceMappingURL=vital.card.model.js.map