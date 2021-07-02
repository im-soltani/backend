"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../../../models");
const pipeline = (_id) => [
    { $match: { _id: mongoose_1.Types.ObjectId(_id) } },
    { $lookup: { from: "users", as: "profile", localField: "uid", foreignField: "_id" } },
    { $unwind: "$profile" }
];
exports.default = (_, { id, input: { name, tel, website, address, country, city, zip_code, location } }, { user: { profile: { _id }, role } }) => models_1.EntrepriseModel.findById(role == "ADMIN" ? id : _id).then(entreprise => {
    if (!entreprise) {
        return null;
    }
    entreprise.name = name;
    entreprise.tel = tel;
    entreprise.website = website;
    entreprise.address = address;
    entreprise.country = country;
    entreprise.city = city;
    entreprise.zip_code = zip_code;
    // todo
    // (entreprise as any).location.coordinates = [latitude || (entreprise as any).location.coordinates.latitude, longitude || (entreprise as any).location.coordinates.longitude];
    return entreprise.save().then(entreprise => {
        return models_1.EntrepriseModel.aggregate(pipeline(entreprise.id)).then(entreprises => entreprises[0]);
    });
});
//# sourceMappingURL=update.entreprise.details.mutation.js.map