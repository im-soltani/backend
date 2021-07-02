"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const para_pharma_sub_category_model_1 = require("./para.pharma.sub.category.model");
exports.paraEntrepriseCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });
exports.paraEntrepriseCategorySchema.pre("remove", function (next) {
    para_pharma_sub_category_model_1.ParaEntrepriseSubCategoryModel.remove({ category_id: this._id })
        .then(() => next())
        .catch(err => next(err));
});
exports.ParaEntrepriseCategoryModel = mongoose_1.model("para_entreprise_categories", exports.paraEntrepriseCategorySchema);
//# sourceMappingURL=para.pharma.category.model.js.map