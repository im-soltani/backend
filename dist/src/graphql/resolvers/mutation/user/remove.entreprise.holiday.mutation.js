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
const pipeline = (id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $lookup: { from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id" } },
    { $lookup: { from: "conversations", as: "conversations", localField: "_id", foreignField: "entreprise_id" } },
    { $unwind: "$profile" },
];
exports.default = (_, { day, month }, { user: { profile: { _id, work_holidays } } }) => __awaiter(this, void 0, void 0, function* () {
    let newHolidaysResult = [];
    if (work_holidays) {
        newHolidaysResult = work_holidays.filter(holiday => !(holiday.day == day && holiday.month == month));
    }
    return models_1.EntrepriseModel.updateOne({ _id }, { $set: { work_holidays: newHolidaysResult } })
        .then(() => models_1.EntrepriseModel.aggregate(pipeline(_id)).then(profiles => profiles[0]));
});
//# sourceMappingURL=remove.entreprise.holiday.mutation.js.map