"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const filter = [
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$entreprise" },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $unwind: "$candidat" }
];
const pipeline = ({ id, _id, role }) => {
    switch (role) {
        case "PHARMACY":
            return [
                { $match: { _id: mongoose_1.Types.ObjectId(id), entreprise_id: mongoose_1.Types.ObjectId(_id) } },
                ...filter
            ];
        case "CLIENT":
            return [
                { $match: { _id: mongoose_1.Types.ObjectId(id), candidat_id: mongoose_1.Types.ObjectId(_id) } },
                ...filter
            ];
        default:
            return [
                { $match: { _id: mongoose_1.Types.ObjectId(id) } },
                ...filter
            ];
    }
};
exports.default = (_, { id }, { user: { role, profile: { _id } } }) => __awaiter(this, void 0, void 0, function* () {
    return models_1.ApplicationModel.aggregate(pipeline({
        id,
        _id,
        role
    })).then(applications => applications[0]);
});
//# sourceMappingURL=application.query.js.map