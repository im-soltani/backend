"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (filter) => [
    { $match: Object.assign({}, filter) },
    { $lookup: { from: "messages", as: "messages", localField: "_id", foreignField: "conversation_id" } },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $unwind: "$candidat" },
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$entreprise" },
    { $lookup: { from: "users", as: "candidat.profile", localField: "candidat.uid", foreignField: "_id" } },
    { $unwind: "$candidat.profile" },
    { $lookup: { from: "users", as: "entreprise.profile", localField: "entreprise.uid", foreignField: "_id" } },
    { $unwind: "$entreprise.profile" },
    {
        $group: {
            _id: "$_id",
            createdAt: { $first: "$createdAt" },
            candidat: { $first: "$candidat" },
            entreprise: { $first: "$entreprise" },
            messages: { $addToSet: "$messages" }
        }
    },
    { $unwind: "$messages" }
];
exports.default = (_, { id }, { user: { role, profile: { _id } } }) => {
    const filter = role == "CLIENT" ? { candidat_id: mongoose_1.Types.ObjectId(_id), entreprise_id: mongoose_1.Types.ObjectId(id) } : { candidat_id: mongoose_1.Types.ObjectId(id), entreprise_id: mongoose_1.Types.ObjectId(_id) };
    return models_1.ConversationModel.find(filter).then(conversation => {
        if (!conversation.length) {
            return new models_1.ConversationModel(filter).save().then(() => {
                return models_1.ConversationModel.aggregate(pipeline(filter)).then(conversations => conversations[0]);
            });
        }
        else {
            return models_1.ConversationModel.aggregate(pipeline(filter)).then(conversations => {
                if (!conversations.length) {
                    return null;
                }
                else {
                    const conversation = conversations[0];
                    if (!conversation._id) {
                        const result = Object.assign({}, conversation, { messages: [] });
                        return result;
                    }
                    else {
                        return conversation;
                    }
                }
            });
        }
    });
};
//# sourceMappingURL=conversation.query.js.map