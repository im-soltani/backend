"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deliveryManSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entreprise_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    tel: {
        type: String,
        required: true
    },
    is_on_work: {
        type: Boolean,
        default: false
    }
});
exports.DeliveryManModel = mongoose_1.model("delivery_men", deliveryManSchema);
//# sourceMappingURL=devlivery.man.model.js.map