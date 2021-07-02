import { Types } from "mongoose";

import { EntrepriseModel, UserModel } from "../../../../models";

const pipeline = _id => [
  { $match: { _id: Types.ObjectId(_id) } },
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$profile" },
  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "entreprise_id"
    }
  },
  {
    $lookup: {
      from: "users",
      as: "userrs",
      localField: "uid",
      foreignField: "_id"
    }
  },
];

export default (
  _,
  {
    id,
    input: {
      application_email,
      activity,
      effective,
      email,
      name_of_in_charge,
      description,
      name,
      tel,
      website,
      address,
      country,
      city,
      zip_code,
      address_2,
      zip_code_2,
      country_2,
      city_2,
      youtubeLink,
      linkedinLink,
      ent_type
    }
  },
  {
    user: {
      profile: { _id },
      role
    }
  }
) =>
  EntrepriseModel.findById(id).then(async entreprise => {
    if (!entreprise) {
      return null;
    }
    return UserModel.findById(entreprise.uid).then(async user => {
      if (!user) {
        return null;
      } else {
        if ((user as any).email === email) {
          (entreprise as any).description = description;
          (entreprise as any).name = name;
          (entreprise as any).tel = tel;
          (entreprise as any).website = website;
          (entreprise as any).address = address;
          (entreprise as any).country = country;
          (entreprise as any).city = city;
          (entreprise as any).zip_code = zip_code;
          (entreprise as any).address_2 = address_2;
          (entreprise as any).country_2 = country_2;
          (entreprise as any).city_2 = city_2;
          (entreprise as any).zip_code_2 = zip_code_2;
          (entreprise as any).application_email = application_email;
          (entreprise as any).name_of_in_charge = name_of_in_charge;
          (entreprise as any).activity = activity;
          (entreprise as any).effective = effective;
          (entreprise as any).youtubeLink = youtubeLink;
          (entreprise as any).linkedinLink = linkedinLink;
          (entreprise as any).ent_type = ent_type;
          return entreprise.save().then(entreprise => {
            return EntrepriseModel.aggregate(pipeline(entreprise.id)).then(
              entreprises => {
                EntrepriseModel.createMapping(function (err, mapping) {
                  if (err) {
                    console.log(err);
                  } else {
                    var stream = EntrepriseModel.synchronize();
                    var count = 0;

                    stream.on("data", function (err, doc) {
                      count++;
                    });
                    stream.on("close", function () { });
                    stream.on("error", function (err) {
                      console.log(err);
                    });
                  }
                });
                return (entreprises[0]);

              }
            );
          });
        } else {
          (user as any).email = email;
          return user.save().then(res => {
            (entreprise as any).description = description;
            (entreprise as any).name = name;
            (entreprise as any).tel = tel;
            (entreprise as any).website = website;
            (entreprise as any).address = address;
            (entreprise as any).country = country;
            (entreprise as any).city = city;
            (entreprise as any).zip_code = zip_code;
            (entreprise as any).address_2 = address_2;
            (entreprise as any).country_2 = country_2;
            (entreprise as any).city_2 = city_2;
            (entreprise as any).zip_code_2 = zip_code_2;
            (entreprise as any).application_email = application_email;
            (entreprise as any).name_of_in_charge = name_of_in_charge;
            (entreprise as any).activity = activity;
            (entreprise as any).effective = effective;
            (entreprise as any).youtubeLink = youtubeLink;
            (entreprise as any).linkedinLink = linkedinLink;
            (entreprise as any).ent_type = ent_type;
            return entreprise.save().then(entreprise => {
              return EntrepriseModel.aggregate(pipeline(entreprise.id)).then(
                entreprises => {
                  EntrepriseModel.createMapping(function (err, mapping) {
                    if (err) {
                      console.log(err);
                    } else {
                      var stream = EntrepriseModel.synchronize();
                      var count = 0;

                      stream.on("data", function (err, doc) {
                        count++;
                      });
                      stream.on("close", function () { });
                      stream.on("error", function (err) {
                        console.log(err);
                      });
                    }
                  });
                  return (entreprises[0]);

                }
              );
            });
          });
        }
      }
    });
  });
