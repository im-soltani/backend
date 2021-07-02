"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("./admin");
const candidat_1 = require("./candidat");
const application_1 = require("./application");
const conversation_1 = require("./conversation");
const conversationconnection_1 = require("./conversationconnection");
const location_1 = require("./location");
const message_1 = require("./message");
const mutualcard_1 = require("./mutualcard");
const entreprise_1 = require("./entreprise");
const prescription_1 = require("./prescription");
const user_1 = require("./user");
const vitalcard_1 = require("./vitalcard");
exports.default = {
    Admin: admin_1.default,
    Candidat: candidat_1.default,
    VitalCard: vitalcard_1.default,
    Application: application_1.default,
    Conversation: conversation_1.default,
    ConversationConnection: conversationconnection_1.default,
    Location: location_1.default,
    Message: message_1.default,
    MutualCard: mutualcard_1.default,
    Entreprise: entreprise_1.default,
    Prescription: prescription_1.default,
    User: user_1.default
};
//# sourceMappingURL=index.js.map