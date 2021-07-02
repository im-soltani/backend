"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StripeSourceSchema = new mongoose_1.Schema({
    id: String,
    object: String,
    address_city: String,
    address_country: String,
    address_line1: String,
    address_line1_check: String,
    address_line2: String,
    address_state: String,
    address_zip: String,
    address_zip_check: String,
    brand: String,
    country: String,
    customer: String,
    cvc_check: String,
    dynamic_last4: String,
    exp_month: Number,
    exp_year: Number,
    fingerprint: String,
    funding: String,
    last4: String,
    metadata: mongoose_1.Schema.Types.Mixed,
    name: String,
    tokenization_method: mongoose_1.Schema.Types.Mixed,
});
const candidatSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    num: {
        type: Number,
        required: true,
        unique: true
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
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        lowercase: true
    },
    health_book: {
        height: {
            type: Number
        },
        weight: {
            type: Number
        },
        age: {
            type: Number
        },
        consumed_medications: {
            type: String
        },
        pharmaceuticals_consumer: {
            type: Boolean,
            default: false
        },
        is_allergic_of_pharmaceuticals: {
            type: Boolean,
            default: false
        },
        additional_information: {
            type: String,
        },
        pregnancy_information: {
            type: String
        }
    },
    stripe: {
        type: {
            id: String,
            src_fingerprints: {
                type: [String],
                default: []
            }
        }
    }
}, { timestamps: true, versionKey: false });
exports.CandidatModel = mongoose_1.model("candidats", candidatSchema);
//# sourceMappingURL=candidat.model.js.map