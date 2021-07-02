"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paraEntrepriseSchema = new mongoose_1.Schema({
    category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    sub_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    nested_sub_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    laboratory: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img_url: {
        type: String,
    },
    indications: {
        type: String,
    },
    presentation: {
        type: String
    },
    usage_tips: {
        type: String
    },
    composition: {
        type: String
    },
    precautions: {
        type: String
    },
    entreprises: {
        type: [{
                id: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }],
        default: []
    },
    bar_code: {
        type: String,
        unique: true,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });
exports.ParaEntrepriseModel = mongoose_1.model("para_Entreprises", paraEntrepriseSchema);
//# sourceMappingURL=para.pharma.model.js.map