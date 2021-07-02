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
const mailer_1 = require("../../../../../common/mailer");
const models_1 = require("../../../../models");
const counter_model_1 = require("../../../../models/counter.model");
const pipeline = id => [
    { $match: { _id: mongoose_1.Types.ObjectId(id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { file, input }) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        /*    const filename = `${Date.now()}.jpg`;
           const path = `uploads/avatars/${filename}`;
           const {stream} = await file;
           stream.pipe(createWriteStream(path))
               .on("finish", () => {
                   const profile_pic_url = `/media/avatars/${filename}`;
                   if (!existsSync("uploads/avatars")) {
                       shelljs.mkdir("-p", "uploads/avatars");
                   } */
        return new models_1.UserModel(Object.assign({}, input, { ref: "entreprises", profile_pic_url: "any" })).save().then((user) => __awaiter(this, void 0, void 0, function* () {
            return new models_1.EntrepriseModel(Object.assign({ uid: user._id }, input, { num: yield counter_model_1.getNextSequenceValue("entreprises"), location: { coordinates: [input.location.latitude || 0, input.location.longitude || 0] } })).save().then((entreprise) => {
                return models_1.EntrepriseModel.aggregate(pipeline(entreprise._id)).then(entreprises => {
                    mailer_1.default({
                        template: "inscription_pharmacie",
                        footer: true,
                        from: "contact@pharmaloop.fr",
                        to: entreprises[0].profile.email,
                        subject: "Inscription",
                        vars: {
                            email: input.email,
                            password: input.password
                        }
                    });
                    return resolve(entreprises[0]);
                });
            }).catch((err) => __awaiter(this, void 0, void 0, function* () {
                yield user.remove();
                throw err;
            }));
        })).catch(err => reject(err));
        /*          })
                 .on("error", err => reject(err)); */
    }));
};
//# sourceMappingURL=add.entreprise.mutation.js.map