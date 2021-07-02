"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mutualCardSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    url: String
}, { timestamps: true, versionKey: false });
exports.MutualCardModel = mongoose_1.model("mutual_cards", mutualCardSchema);
//# sourceMappingURL=mutual.card.model.js.map