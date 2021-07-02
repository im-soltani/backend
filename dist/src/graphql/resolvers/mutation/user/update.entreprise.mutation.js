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
const pipeline = (_id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { id, input, input: { file, profile_pic_url, description, work_schedule, is_pill_maker, name, tel, website, address, country, city, zip_code, location: { latitude, longitude } } }, { user, user: { profile: { _id }, role } }) => models_1.EntrepriseModel.findById(role == "ADMIN" ? id : _id).then((entreprise) => __awaiter(this, void 0, void 0, function* () {
    if (!entreprise) {
        return null;
    }
    yield file;
    if (file) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const filename = `${Date.now()}.jpg`;
            const path = `uploads/avatars/${filename}`;
            if (!fs_1.existsSync("uploads/avatars")) {
                shelljs.mkdir("-p", "uploads/avatars");
            }
            const { stream } = yield file;
            stream.pipe(fs_1.createWriteStream(path))
                .on("finish", () => {
                models_1.UserModel.findOne({ _id: mongoose_1.Types.ObjectId(entreprise.uid) })
                    .then((user) => __awaiter(this, void 0, void 0, function* () {
                    user.profile_pic_url = `/media/avatars/${filename}`;
                    user.save().then(() => {
                        entreprise.name = name;
                        entreprise.location = Object.assign({}, entreprise.location, { coordinates: [latitude, longitude] });
                        entreprise.description = description;
                        entreprise.tel = tel;
                        entreprise.website = website;
                        entreprise.address = address;
                        entreprise.country = country;
                        entreprise.city = city;
                        entreprise.zip_code = zip_code;
                        entreprise.is_pill_maker = is_pill_maker;
                        entreprise.work_schedule = work_schedule;
                        return entreprise.save().then(entreprise => {
                            models_1.EntrepriseModel.aggregate(pipeline(entreprise.id)).then(entreprises => resolve(entreprises[0]));
                        });
                    });
                })).catch(err => reject(err));
            })
                .on("error", err => reject(err));
        }));
    }
    else if (profile_pic_url) {
        entreprise.location = Object.assign({}, entreprise.location, { coordinates: [latitude, longitude] });
        entreprise.description = description;
        entreprise.name = name;
        entreprise.tel = tel;
        entreprise.website = website;
        entreprise.address = address;
        entreprise.country = country;
        entreprise.city = city;
        entreprise.zip_code = zip_code;
        entreprise.is_pill_maker = is_pill_maker;
        entreprise.work_schedule = work_schedule;
        return entreprise.save().then(entreprise => {
            return models_1.EntrepriseModel.aggregate(pipeline(entreprise.id)).then(entreprises => entreprises[0]);
        });
    }
    else {
        yield models_1.UserModel.findOne({ _id: mongoose_1.Types.ObjectId(entreprise.uid) })
            .then(user => {
            user.profile_pic_url = null;
            return user.save();
        });
        entreprise.location = Object.assign({}, entreprise.location, { coordinates: [latitude, longitude] });
        entreprise.description = description;
        entreprise.name = name;
        entreprise.tel = tel;
        entreprise.website = website;
        entreprise.address = address;
        entreprise.country = country;
        entreprise.city = city;
        entreprise.zip_code = zip_code;
        entreprise.is_pill_maker = is_pill_maker;
        entreprise.work_schedule = work_schedule;
        return entreprise.save().then(entreprise => {
            return models_1.EntrepriseModel.aggregate(pipeline(entreprise.id)).then(entreprises => entreprises[0]);
        });
    }
}));
//# sourceMappingURL=update.entreprise.mutation.js.map