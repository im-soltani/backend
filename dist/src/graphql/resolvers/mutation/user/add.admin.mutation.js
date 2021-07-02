"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../models");
const pipeline = [
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { input }) => new models_1.UserModel(Object.assign({}, input, { ref: "admins" })).save()
    .then(({ _id }) => new models_1.AdminModel({ uid: _id }).save().then(() => models_1.AdminModel.aggregate(pipeline).then(admins => admins[0])));
//# sourceMappingURL=add.admin.mutation.js.map