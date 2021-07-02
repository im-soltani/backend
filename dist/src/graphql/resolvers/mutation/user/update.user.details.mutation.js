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
const models_1 = require("../../../../models");
exports.default = (_, { id, input: { password, profile_pic_url } }) => models_1.UserModel.findById(id).then((user) => __awaiter(this, void 0, void 0, function* () {
    if (!user) {
        return user;
    }
    if (!user.isValidPassword(password)) {
        user.password = yield models_1.UserModel.hashPassword(password);
    }
    user.profile_pic_url = profile_pic_url;
    return user.save();
}));
//# sourceMappingURL=update.user.details.mutation.js.map