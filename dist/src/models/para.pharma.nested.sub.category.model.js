"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nestedMedicationSubCategorySchema = new mongoose_1.Schema({
    sub_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });
exports.ParaEntrepriseNestedSubCategoryModel = mongoose_1.model("para_entreprise_nested_sub_category", nestedMedicationSubCategorySchema);
//# sourceMappingURL=para.pharma.nested.sub.category.model.js.map