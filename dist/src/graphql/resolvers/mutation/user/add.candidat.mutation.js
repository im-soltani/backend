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
const fs_1 = require("fs");
const shelljs = require("shelljs");
const models_1 = require("../../../../models");
const counter_model_1 = require("../../../../models/counter.model");
const pipeline = [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { file, input }) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    const filename = `${Date.now()}.jpg`;
    const path = `uploads/avatars/${filename}`;
    if (!fs_1.existsSync("uploads/avatars")) {
        shelljs.mkdir("-p", "uploads/avatars");
    }
    const { stream } = yield file;
    stream.pipe(fs_1.createWriteStream(path))
        .on("finish", () => {
        const profile_pic_url = `/media/avatars/${filename}`;
        new models_1.UserModel(Object.assign({}, input, { ref: "candidats", profile_pic_url })).save().then(({ _id }) => __awaiter(this, void 0, void 0, function* () {
            return new models_1.CandidatModel(Object.assign({ uid: _id }, input, { num: yield counter_model_1.getNextSequenceValue("candidats") }))
                .save()
                .then(() => models_1.CandidatModel.aggregate(pipeline).then(candidats => resolve(candidats[0])));
        }))
            .catch(err => reject(err));
    })
        .on("error", err => reject(err));
}));
//# sourceMappingURL=add.candidat.mutation.js.map