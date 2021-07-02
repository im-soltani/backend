"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const notification_1 = require("../../../../notification");
const utils_1 = require("../../../../tools/utils");
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
exports.default = (_, { input: { id, body, type } }, { user: { role, profile: { _id } } }) => {
    const candidat_id = mongoose_1.Types.ObjectId(role == "CLIENT" ? _id : id);
    const entreprise_id = mongoose_1.Types.ObjectId(role == "CLIENT" ? id : _id);
    return models_1.ConversationModel.findOne({
        candidat_id,
        entreprise_id
    }).then(result => {
        if (!result) {
            const conversation = new models_1.ConversationModel({ candidat_id, entreprise_id });
            return conversation.save().then(conversation => addMessage({
                conversation_id: conversation._id,
                sender_id: _id,
                candidat_id,
                entreprise_id,
                body,
                type
            }, _id));
        }
        else {
            return addMessage({
                conversation_id: result._id,
                sender_id: _id,
                candidat_id,
                entreprise_id,
                body,
                type
            }, _id);
        }
    });
};
const addMessage = (data, uid) => new Promise((resolve, reject) => {
    require("events").EventEmitter.prototype._maxListeners = 100;
    const message = new models_1.MessageModel(Object.assign({}, data));
    message.save()
        .then(({ _id }) => {
        models_1.MessageModel.aggregate(pipeline(_id)).then(messages => {
            const message = messages[0];
            pubsub_1.default.publish("MESSAGE_ADDED", { messageAdded: message });
            // if ((message as any).sender_id.toString() != uid.toString()) {
            if (message.sender_id.toString() == message.candidat._id.toString()) {
                const entreprise_id = message.entreprise.uid;
                // send to entreprise + message + metadata: {type == "MESSAGE")
                notification_1.default.sendToEntreprise({
                    userId: entreprise_id,
                    body: `Vous avez reçu un nouveau message de ${utils_1.capitalizeFirstLetter(message.candidat.first_name) + " " + utils_1.capitalizeFirstLetter(message.candidat.last_name)}`,
                    data: { candidat: { id: message.candidat._id, first_name: message.candidat.first_name, last_name: message.candidat.last_name }, type: "MESSAGE" }
                });
            }
            else {
                const candidat_id = message.candidat.uid;
                // send message
                notification_1.default.sendToCandidat({
                    userId: candidat_id,
                    body: `Votre pharmacien vous a envoyé un message`,
                    data: { entreprise: { id: message.entreprise._id, name: message.entreprise.name }, type: "MESSAGE" }
                });
            }
            // }
            // else{
            //     console.log("dont work",(JSON.stringify(message)).toString(),uid.toString())
            // }
            resolve(message);
        });
    })
        .catch(err => reject(err));
});
//# sourceMappingURL=add.message.mutation.js.map