import { Types } from "mongoose";
import { CandidatModel, UserModel } from "../../../../models";

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
  { $unwind: "$profile" }
];

export default (
  _,
  {
    id,
    input: {
      competences,
      softskills,
      etude,
      tel,
      email,
      experience,
      address,
      zip_code,
      country,
      city,
      twitter,
      siteweb,
      linkedin,
      contract,
      jobs,
      letter,
      first_name,
      last_name,
      age,
      sexe,
      disponibility
    }
  },
  {
    user: {
      profile: { _id },
      role
    }
  }
) =>
  CandidatModel.findById(role == "ADMIN" ? id : _id).then(async candidat => {
    if (!candidat) {
      return null;
    }
    return UserModel.findById(candidat.uid).then(async user => {
      if (!user) {
        return null;
      } else {
        if ((user as any).email === email) {
          (candidat as any).disponibility = disponibility
            ? disponibility
            : (candidat as any).disponibility;
          (candidat as any).last_name = last_name;
          (candidat as any).first_name = first_name;
          (candidat as any).tel = tel;
          (candidat as any).address = address;
          (candidat as any).letter = letter ? letter : (candidat as any).letter;
          (candidat as any).country = country;
          (candidat as any).city = city;
          (candidat as any).zip_code = zip_code;
          (candidat as any).twitter = twitter;
          (candidat as any).siteweb = siteweb;
          (candidat as any).linkedin = linkedin;
          (candidat as any).jobs = jobs ? jobs : (candidat as any).jobs;
          (candidat as any).contract = contract
            ? contract
            : (candidat as any).contract;
          (candidat as any).experience = experience
            ? experience
            : (candidat as any).experience;
          (candidat as any).etude = etude ? etude : (candidat as any).etude;
          (candidat as any).competences = competences
            ? competences
            : (candidat as any).competences;
          (candidat as any).softskills = softskills
            ? softskills
            : (candidat as any).softskills;
          (candidat as any).age = age ? age : (candidat as any).age;
          (candidat as any).sexe = sexe ? sexe : (candidat as any).sexe;
          return candidat.save().then(entreprise => {
            return CandidatModel.aggregate(pipeline(entreprise.id)).then(
              candidats => {
                CandidatModel.createMapping(function (err, mapping) {
                  if (err) {
                    console.log(err);
                  } else {
                    var stream = CandidatModel.synchronize();
                    var count = 0;

                    stream.on("data", function (err, doc) {
                      count++;
                    });
                    stream.on("close", function () {});
                    stream.on("error", function (err) {
                      console.log(err);
                    });
                  }
                });
                return candidats[0];
              }
            );
          });
        } else {
          (user as any).email = email;
          return user.save().then(res => {
            (candidat as any).disponibility = disponibility
              ? disponibility
              : (candidat as any).disponibility;
            (candidat as any).last_name = last_name;
            (candidat as any).first_name = first_name;
            (candidat as any).tel = tel;
            (candidat as any).address = address;
            (candidat as any).letter = letter
              ? letter
              : (candidat as any).letter;
            (candidat as any).country = country;
            (candidat as any).city = city;
            (candidat as any).zip_code = zip_code;
            (candidat as any).twitter = twitter;
            (candidat as any).siteweb = siteweb;
            (candidat as any).linkedin = linkedin;
            (candidat as any).jobs = jobs ? jobs : (candidat as any).jobs;
            (candidat as any).contract = contract
              ? contract
              : (candidat as any).contract;
            (candidat as any).experience = experience
              ? experience
              : (candidat as any).experience;
            (candidat as any).etude = etude ? etude : (candidat as any).etude;
            (candidat as any).competences = competences
              ? competences
              : (candidat as any).competences;
            (candidat as any).softskills = softskills
              ? softskills
              : (candidat as any).softskills;
            (candidat as any).age = age ? age : (candidat as any).age;
            (candidat as any).sexe = sexe ? sexe : (candidat as any).sexe;
            return candidat.save().then(entreprise => {
              return CandidatModel.aggregate(pipeline(entreprise.id)).then(
                candidats => {
                  CandidatModel.createMapping(function (err, mapping) {
                    if (err) {
                      console.log(err);
                    } else {
                      var stream = CandidatModel.synchronize();
                      var count = 0;

                      stream.on("data", function (err, doc) {
                        count++;
                      });
                      stream.on("close", function () {});
                      stream.on("error", function (err) {
                        console.log(err);
                      });
                    }
                  });
                  return candidats[0];
                }
              );
            });
          });
        }
      }
    });
  });