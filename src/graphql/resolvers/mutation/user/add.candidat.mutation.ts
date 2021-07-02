import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";

import { CandidatModel, CVModel, UserModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";

const pipeline = [
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
const saveFile = ({ stream }, filename, id) =>
  new Promise((resolve, reject) => {
    const path = `uploads/cvs/${filename}`;
    if (!existsSync("uploads/cvs")) {
      shelljs.mkdir("-p", "uploads/cvs");
    }
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => {
        const cv = new CVModel({
          uid: id,
          url: `/media/cv/${filename}`,
          displayed: true
        });
        cv.save().then(resultat => {
          resolve({
            url: `/media/cv/${filename}`
          });
        });
      })
      .on("error", error => {
        reject(error);
      });
  });

export default (_, { avatar, cv, input }) =>
  new Promise(async (resolve, reject) => {
    const filename = `${Date.now()}.jpg`;
    const path = `uploads/avatars/${filename}`;
    if (!existsSync("uploads/avatars")) {
      shelljs.mkdir("-p", "uploads/avatars");
    }
    if (avatar) {
      const { stream } = await avatar;

      stream
        .pipe(createWriteStream(path))
        .on("finish", () => {
          const profile_pic_url = `/media/avatars/${filename}`;
          new UserModel({ ...input, ref: "candidats" })
            .save()
            .then(async ({ _id }) => {
              new CandidatModel({
                uid: _id,
                ...input,
                profile_pic_url,
                num: await getNextSequenceValue("candidats")
              })
                .save()
                .then(() => {
                  CandidatModel.aggregate(pipeline)
                    .then(async candidats => {
                      CandidatModel.createMapping(function (err, mapping) {
                        if (err) {
                          console.log(err);
                        } else {
                          var stream = CandidatModel.synchronize();
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
                      if (cv) {
                        const f = await cv;
                        const mimetype = f.mimetype.split("/")[1];
                        saveFile(
                          f,
                          `${_id}${Date.now()}.${mimetype}`,
                          candidats[0]._id
                        );
                      } else {
                        resolve(candidats[0]);
                      }
                    })
                    .catch(err => reject(err));
                })

                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        })
        .on("error", err => reject(err));
    } else {
      let hamza = new UserModel({ ...input, ref: "candidats" });
      hamza
        .save()
        .then(async ({ _id }) => {
          hamza.on("es-indexed", function () {
            console.log("document indexed");
          });
          new CandidatModel({
            uid: _id,
            ...input,
            num: await getNextSequenceValue("candidats")
          })
            .save()
            .then(newCandidat => {
              CandidatModel.aggregate(pipeline)
                .then(async candidats => {
                  CandidatModel.createMapping(function (err, mapping) {
                    if (err) {
                      console.log(err);
                    } else {
                      var stream = CandidatModel.synchronize();
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
                  if (cv) {
                    const f = await cv;
                    const mimetype = f.mimetype.split("/")[1];
                    saveFile(
                      f,
                      `${_id}${Date.now()}.${mimetype}`,
                      candidats[0]._id
                    );
                  } else {
                    newCandidat.index(function (err, res) {
                      console.log("egads! I've been indexed!");
                    });
                    resolve(candidats[0]);
                  }
                })
                .catch(err => reject(err));
            })

            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    }
  });
