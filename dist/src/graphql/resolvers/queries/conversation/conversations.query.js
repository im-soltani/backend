"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (_id, role) => [
    { $match: role == "CLIENT" ? { candidat_id: mongoose_1.Types.ObjectId(_id) } : { entreprise_id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "messages", as: "messages", localField: "_id", foreignField: "conversation_id" } },
    { $unwind: "$messages" },
    { $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
    { $unwind: "$candidat" },
    { $lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" } },
    { $unwind: "$entreprise" },
    { $lookup: { from: "users", as: "candidat.profile", localField: "candidat.uid", foreignField: "_id" } },
    { $unwind: "$candidat.profile" },
    { $lookup: { from: "users", as: "entreprise.profile", localField: "entreprise.uid", foreignField: "_id" } },
    { $unwind: "$entreprise.profile" },
    { $lookup: { from: "messages", as: "last_message", localField: "_id", foreignField: "conversation_id" } },
    {
        $group: {
            _id: "$_id",
            createdAt: { $first: "$createdAt" },
            last_message: { $first: "$last_message" },
            candidat: { $first: "$candidat" },
            entreprise: { $first: "$entreprise" },
            messages: {
                $push: {
                    _id: "$messages._id",
                    body: "$messages.body",
                    candidat_id: "$candidat_id",
                    entreprise_id: "$entreprise_id",
                    sender_id: "$messages.sender_id",
                    type: "$messages.type",
                    candidat: "$candidat",
                    entreprise: "$entreprise",
                    createdAt: "$messages.createdAt"
                }
            }
        }
    }
];
exports.default = (_, __, { user: { role, profile: { _id } } }) => {
    return models_1.ConversationModel.aggregate(pipeline(_id, role)).then(result => result.sort((a, b) => b.last_message[b.last_message.length - 1].createdAt - a.last_message[a.last_message.length - 1].createdAt));
};
//# sourceMappingURL=conversations.query.js.map