import {Types} from "mongoose";
import {EntrepriseModel, OfferModel} from "../../../../models";

const pipeline = (_id) => [
    {$match: {_id: Types.ObjectId(_id)}},
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$unwind: "$profile"}
];

export default (_, {id, input: {name, tel, website, address, country, city, zip_code, location}}, {user: {profile: {_id}, role}}) => EntrepriseModel.findById(role == "ADMIN" ? id : _id).then(entreprise => {
    if (!entreprise) {
        return null;
    }
    (entreprise as any).name = name;
    (entreprise as any).tel = tel;
    (entreprise as any).website = website;
    (entreprise as any).address = address;
    (entreprise as any).country = country;
    (entreprise as any).city = city;
    (entreprise as any).zip_code = zip_code;
 
    // todo
    // (entreprise as any).location.coordinates = [latitude || (entreprise as any).location.coordinates.latitude, longitude || (entreprise as any).location.coordinates.longitude];
    return entreprise.save().then(entreprise => {
        OfferModel.createMapping(function(err, mapping) {
            if (err) {
              console.log(err);
            } else {
              var stream = OfferModel.synchronize();
              var count = 0;
  
              stream.on("data", function(err, doc) {
                count++;
              });
              stream.on("close", function() {});
              stream.on("error", function(err) {
                console.log(err);
              });
            }
          });
        return EntrepriseModel.aggregate(pipeline(entreprise.id)).then(entreprises => entreprises[0]);
    });
});