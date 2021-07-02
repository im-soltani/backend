"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const mongoose_1 = require("mongoose");
exports.default = {
    id: (_) => _._id,
    vital_card: (_) => models_1.VitalCardModel.find({ uid: mongoose_1.Types.ObjectId(_._id) }).then(cards => cards[0]),
    mutual_card: (_) => models_1.MutualCardModel.find({ uid: mongoose_1.Types.ObjectId(_._id) }).then(cards => cards[0]),
};
//# sourceMappingURL=candidat.js.map