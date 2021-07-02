"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rateSchema = new mongoose_1.Schema({
    candidat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entreprise_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    value: {
        type: Number,
        required: true,
        enum: ["1", "2", "3", "4", "5"]
    }
}, { timestamps: true, versionKey: false });
exports.RateModel = mongoose_1.model("rates", rateSchema);
//# sourceMappingURL=rate.model.js.map