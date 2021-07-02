"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paraEntrepriseSubCategorySchema = new mongoose_1.Schema({
    category_id: {
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
paraEntrepriseSubCategorySchema.pre("remove", function (next) {
    console.log("Handle remove middleWare");
    next();
});
exports.ParaEntrepriseSubCategoryModel = mongoose_1.model("para_entreprise_sub_categories", paraEntrepriseSubCategorySchema);
//# sourceMappingURL=para.pharma.sub.category.model.js.map