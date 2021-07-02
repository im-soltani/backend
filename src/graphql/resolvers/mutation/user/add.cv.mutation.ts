import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";
var extract = require("pdf-text-extract");
import { Types } from "mongoose";
import { CandidatModel } from "../../../../models";

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

export default (_, { id, file, type }, { user: { _id, role } }) =>
  new Promise(async (resolve, reject) => {
    const filename = `${Date.now()}.pdf`;
    const path = `uploads/cvs/${filename}`;
    if (!existsSync("uploads/cvs")) {
      shelljs.mkdir("-p", "uploads/cvs");
    }
    if (file) {
      const { stream } = await file;

      stream
        .pipe(createWriteStream(path))
        .on("finish", () => {
          extract(path, function (err, pages) {
            if (err) {
              reject(err);
              return;
            }
            let filter = {};
            if (role === "ADMIN") filter = { _id: Types.ObjectId(id) };
            else filter = { uid: Types.ObjectId(_id) };
            CandidatModel.findOne(filter)
              .then(candidat => {
                if (type === "fr") {
                  candidat.cv = `/media/cvs/${filename}`;
                  candidat.cv_data = pages.join(" ");
                } else {
                  candidat.cv_eng = `/media/cvs/${filename}`;
                  candidat.cv_eng_data = pages.join(" ");
                }

                candidat.save().then(() => {
                  CandidatModel.aggregate(pipeline).then(async candidats => {
                    resolve(candidats[0]);
                  });
                });
              })

              .catch(err => reject(err));
          });
        })
        .on("error", err => reject(err));
    }
  });
