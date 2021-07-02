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
const pubsub_1 = require("../../../pubsub");
const pipeline = (id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(id) } },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$candidat" },
    { $unwind: "$entreprise" },
    { $lookup: { from: "users", as: "candidat.profile", localField: "candidat.uid", foreignField: "_id" } },
    { $lookup: { from: "users", as: "entreprise.profile", localField: "entreprise.uid", foreignField: "_id" } },
    { $unwind: "$candidat.profile" },
    { $unwind: "$entreprise.profile" },
];
exports.default = (_, { id }) => {
    return models_1.MessageModel.findById(id)
        .then((message) => __awaiter(this, void 0, void 0, function* () {
        if (!message) {
            return null;
        }
        else {
            if (!message.seen_at) {
                message.seen_at = Date.now();
                yield message.save();
            }
            return models_1.MessageModel.aggregate(pipeline(id))
                .then(messages => {
                const message = messages[0];
                pubsub_1.default.publish("MESSAGE_SEEN", { messageReaded: message });
                return message;
            });
        }
    }));
};
//# sourceMappingURL=update.message.mutation.js.map