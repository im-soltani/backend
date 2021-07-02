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
const bcrypt = require("bcrypt");
const mailer_1 = require("../../../../../common/mailer");
const models_1 = require("../../../../models");
const contants_1 = require("../../../../tools/contants");
exports.default = (_, { password, oldPassword }, { user: { _id, email, profile: { first_name, last_name, name }, role }, token }) => models_1.UserModel.findById(_id).then(user => {
    if (!user.isValidPassword(oldPassword)) {
        return false;
    }
    return getHashedPassword(password).then(hash => {
        user.password = hash;
        return user.save().then(() => __awaiter(this, void 0, void 0, function* () {
            yield models_1.SessionModel.deleteOne({ uid: _id, token: { $ne: token } });
            switch (role) {
                case contants_1.UserRole.CLIENT:
                    mailer_1.default({
                        template: "modification_mdp_patient",
                        footer: true,
                        from: "contact@pharmaloop.fr",
                        to: email,
                        subject: "Modification du mot de passe",
                        vars: {
                            first_name,
                            last_name
                        }
                    });
                    break;
                case contants_1.UserRole.PHARMACY:
                    mailer_1.default({
                        template: "modification_mdp_pharmacie",
                        footer: true,
                        from: "contact@pharmaloop.fr",
                        to: email,
                        subject: "Modification du mot de passe",
                        vars: {
                            name
                        }
                    });
                    break;
            }
            return true;
        }));
    });
});
const getHashedPassword = (password) => new Promise((resolve, reject) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        resolve(hash);
    }
    catch (e) {
        reject(e);
    }
});
//# sourceMappingURL=change.password.mutation.js.map