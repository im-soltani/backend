"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const prescriptionSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true
    }
});
const paraEntrepriseSchema = new mongoose_1.Schema({
    id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});
const applicationSchema = new mongoose_1.Schema({
    num: {
        type: Number,
        required: true,
        unique: true
    },
    num_original: {
        type: Number
    },
    id_original: {
        type: String
    },
    frequence: {
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        rule: {
            type: String
        }
    },
    candidat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    entreprise_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    prescriptions: {
        type: [prescriptionSchema],
        required: true
    },
    description: {
        type: String
    },
    renouvelable: {
        type: Boolean,
    },
    state: {
        type: String,
        enum: ["PENDING", "APPROVED", "TO_PAY", "PAID", "DELIVERING", "DELIVERED", "CANCELED", "VOIDED", "REVOKED"],
        default: "PENDING"
    },
    revoke_description: {
        type: String
    },
    reject_description: {
        type: String
    },
    to_pay: {
        type: Number
    },
    address: {
        type: String,
    },
    second_address: {
        type: String,
    },
    delivery_mode: {
        type: String,
        default: "FREE",
        enum: ["FREE", "EXPRESS", "IN_DAY"]
    },
    regular_journey: {
        type: Boolean
    },
    delivery_date: {
        type: Number
    },
    tracking_url: {
        type: String
    },
    refunded: {
        type: Boolean,
        default: false
    },
    original: {
        type: String,
        default: "true"
    },
    echanceDate: {
        type: String,
        default: "false"
    },
    renewed: {
        type: Boolean,
        default: false
    },
    para_Entreprises: {
        type: [paraEntrepriseSchema],
        default: []
    }
}, { timestamps: true, versionKey: false });
exports.ApplicationModel = mongoose_1.model("applications", applicationSchema);
//# sourceMappingURL=application.model.js.map