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
const mongoose_1 = require("mongoose");
const shelljs = require("shelljs");
const models_1 = require("../../../../models");
exports.default = (_, { file }, { user: { _id } }) => models_1.UserModel.findOne({ _id: mongoose_1.Types.ObjectId(_id) }).then(user => {
    if (!user) {
        return false;
    }
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const filename = `${Date.now()}.jpg`;
        const path = `uploads/avatars/${filename}`;
        if (!fs_1.existsSync("uploads/avatars")) {
            shelljs.mkdir("-p", "uploads/avatars");
        }
        const { stream } = yield file;
        stream.pipe(fs_1.createWriteStream(path))
            .on("finish", () => {
            user.profile_pic_url = `/media/avatars/${filename}`;
            return user.save().then(() => resolve(true));
        })
            .on("error", err => reject(err));
    }));
});
//# sourceMappingURL=change.avatar.mutation.js.map