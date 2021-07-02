import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";
var extract = require("pdf-text-extract");
import { CandidatModel, UserModel, EntrepriseModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";
import mailer from "../../../../../common/mailer";
import { Types } from "mongoose";

const pipeline = [
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$profile" },
];
export default (
  _,
  { cv, email, mycv, sharedcv, existmail, uid, recieved, rating, input },
  { user: { _id, role } }
) =>
  new Promise(async (resolve, reject) => {
    const filename = `${Date.now()}.pdf`;
    const path = `uploads/cvs/${filename}`;
    if (!existsSync("uploads/cvs")) {
      shelljs.mkdir("-p", "uploads/cvs");
    }
    if (cv) {
      const { stream } = await cv;

      if (mycv && existmail) {
        return CandidatModel.findOne({ uid: Types.ObjectId(uid) })
          .then(async (candidat) => {
            if (!candidat) {
              return null;
            }
            let entreprises = candidat.entreprises;

            let entre = {
              id: _id.toString(),
              mycv: mycv,
              sharedcv: true,
              recieved: recieved,
              rating: rating,
              createdAt: new Date(),
            };
            entreprises.push(entre);
            candidat.entreprises = entreprises;
            return candidat.save().then((candidats) => {
              CandidatModel.aggregate(pipeline).then(async (candidats) => {
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
                resolve(candidats[0]);
              });
            });
          })
          .catch((err) => reject(err));
      } else
        stream
          .pipe(createWriteStream(path))
          .on("finish", () => {
            extract(path, function (err, pages) {
              if (err) {
                reject(err);
                return;
              }
              const entreprises = mycv
                ? [
                    {
                      id: _id.toString(),
                      mycv: mycv,
                      sharedcv: sharedcv,
                      recieved: recieved,
                      rating: rating,
                      createdAt: new Date(),
                    },
                  ]
                : [];
              const inputcandidat = {
                cv: `/media/cvs/${filename}`,
                cv_data: pages.join(" "),
                first_name: input.first_name,
                last_name: input.last_name,
                sharedcv: false,
                note: rating,
                entreprises: entreprises,
              };
              let password = Math.random().toString(36).slice(-8);

              new UserModel({ email, ref: "candidats", password: password })
                .save()
                .then(async (result) => {
                  new CandidatModel({
                    uid: result._id,
                    ...inputcandidat,
                    num: await getNextSequenceValue("candidats"),
                  })
                    .save()
                    .then(() => {
                      CandidatModel.aggregate(pipeline)
                        .then(async (candidats) => {
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
                          EntrepriseModel.findOne({
                            uid: { $in: [Types.ObjectId(_id)] },
                          }).then((entreprised) => {
                            mailer({
                              template: "add_candidat",
                              footer: true,
                              from: '"BoostMyJob"<contact@boostmyjob.com>',
                              to: email,
                              subject: "Votre CV vient d'être ajouté",
                              vars: {
                                name: entreprised.name,
                                email: email,
                                password: password,
                                first_name: input.first_name,
                                last_name: input.last_name,
                              },
                            });
                          });

                          resolve(candidats[0]);
                        })
                        .catch((err) => reject(err));
                    })

                    .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            });
          })
          .on("error", (err) => reject(err));
    }
  });
