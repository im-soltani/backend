"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deliverySchema = new mongoose_1.Schema({
    application_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    delivery_man_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: String,
        enum: ["PENDING", "STARTED", "FINISHED"],
        default: "PENDING"
    }
}, { timestamps: true, versionKey: false });
exports.DeliveryModel = mongoose_1.model("deliveries", deliverySchema);
//# sourceMappingURL=delivery.model.js.map