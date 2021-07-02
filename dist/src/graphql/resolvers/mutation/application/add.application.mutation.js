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
const mailer_1 = require("../../../../../common/mailer");
const models_1 = require("../../../../models");
const counter_model_1 = require("../../../../models/counter.model");
const notification_1 = require("../../../../notification");
const utils_1 = require("../../../../tools/utils");
const pubsub_1 = require("../../../pubsub");
const pipeline = (_id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $unwind: "$candidat" },
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$entreprise" },
    { $lookup: { from: "users", as: "candidat.profile", localField: "candidat.uid", foreignField: "_id" } },
    { $unwind: "$candidat.profile" },
    { $lookup: { from: "users", as: "entreprise.profile", localField: "entreprise.uid", foreignField: "_id" } },
    { $unwind: "$entreprise.profile" },
];
const saveFile = ({ stream }, filename) => new Promise((resolve, reject) => {
    const path = `uploads/prescriptions/${filename}`;
    if (!fs_1.existsSync("uploads/prescriptions")) {
        shelljs.mkdir("-p", "uploads/prescriptions");
    }
    stream.pipe(fs_1.createWriteStream(path))
        .on("finish", () => {
        resolve({
            url: `/media/prescription/${filename}`
        });
    })
        .on("error", error => {
        reject(error);
    });
});
exports.default = (_, { input, files }, { user: { profile: { _id } } }) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        return Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const f = yield file;
            const mimetype = f.mimetype.split("/")[1];
            return saveFile(f, `${_id}${Date.now()}.${mimetype}`);
        }))).then((prescriptions) => __awaiter(this, void 0, void 0, function* () {
            console.log("Input: ", input);
            new models_1.ApplicationModel(Object.assign({ num: yield counter_model_1.getNextSequenceValue("applications") }, input, { candidat_id: _id, prescriptions })).save().then(application => models_1.ApplicationModel.aggregate(pipeline(application._id)).then(applications => {
                const application = applications[0];
                const candidat = application.candidat;
                const entreprise = application.entreprise;
                mailer_1.default({
                    template: "nouvelle_applicatione_pharmacie",
                    footer: true,
                    from: "applicationes@pharmaloop.fr",
                    to: entreprise.profile.email,
                    subject: "Nouvelle applicatione"
                });
                mailer_1.default({
                    template: "confirmation_applicatione_patient",
                    footer: true,
                    from: "applicationes@pharmaloop.fr",
                    to: candidat.profile.email,
                    subject: "Confirmation de applicatione",
                    vars: {
                        first_name: utils_1.capitalizeFirstLetter(candidat.first_name),
                        last_name: utils_1.capitalizeFirstLetter(candidat.last_name),
                        num: application.num,
                    }
                });
                notification_1.default.sendToEntreprise({
                    userId: entreprise.profile._id,
                    body: `Vous avez reçu une nouvelle applicatione de ${utils_1.capitalizeFirstLetter(candidat.first_name) + " " + utils_1.capitalizeFirstLetter(candidat.last_name)}`,
                    data: { id: application._id }
                });
                notification_1.default.sendToCandidat({
                    userId: candidat.profile._id,
                    body: `Votre applicatione a été transmise à votre pharmacien`,
                    data: { id: application._id }
                });
                console.log("notification .......");
                pubsub_1.default.publish("APPLICATION_ADDED", { applicationAdded: application });
                resolve(application);
            })).catch(err => {
                reject(err);
            });
        }));
    });
});
//# sourceMappingURL=add.application.mutation.js.map