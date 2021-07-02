import { createWriteStream, existsSync } from "fs";
import { Types } from "mongoose";

import * as shelljs from "shelljs";
import { OfferModel, EntrepriseModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";

const pipeline = _id => [
  {
    $lookup: {
      from: "entreprises",
      as: "entreprise",
      localField: "entreprise_id",
      foreignField: "_id"
    }
  },
  { $unwind: "$entreprise" },
  {
    $lookup: {
      from: "users",
      as: "entreprise.profile",
      localField: "entreprise.uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$entreprise.profile" }
];
const saveFile = ({ stream }, filename) =>
  new Promise((resolve, reject) => {
    const path = `uploads/banners/${filename}`;
    if (!existsSync("uploads/banners")) {
      shelljs.mkdir("-p", "uploads/banners");
    }
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => {
        resolve({
          url: `/media/banners/${filename}`
        });
      })
      .on("error", error => {
        reject(error);
      });
  });

const saveExtraFile = ({ stream }, filename) =>
  new Promise((resolve, reject) => {
    const path = `uploads/extras/${filename}`;
    if (!existsSync("uploads/extras")) {
      shelljs.mkdir("-p", "uploads/extras");
    }
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => {
        resolve({
          url: `/media/extras/${filename}`
        });
      })
      .on("error", error => {
        reject(error);
      });
  });
export default (
  _,
  { file, extra_file, job_id, softskills_ids, competences_ids, typeFormation, dureeFormation, input },
  { user: { _id, role } }
) =>
  new Promise(async (resolve, reject) => {
    let filtre = input.entreprise_id ?
      {
        _id: Types.ObjectId(input.entreprise_id)
      } : {
        uid: _id
      }
    EntrepriseModel.findOne(filtre).then(async entre => {
      return Promise.all(
        [file, extra_file].map(async (file, i) => {
          if (i === 0 && file && typeof file !== "string") {
            const f = await file;
            const mimetype = f.mimetype.split("/")[1];
            return saveFile(f, `${_id}${Date.now()}.${mimetype}`);
          }
          if (i === 1 && file && typeof file !== "string") {
            const f = await file;
            const extra_filename = `${Date.now()}.pdf`;
            return saveExtraFile(f, extra_filename);
          }
        })
      ).then(async urls => {
        let model = {
          ...input,
          banner:
            urls && urls[0] && (urls[0] as any).url
              ? (urls[0] as any).url
              : `/media/banners/banner.png`,
          extra_file:
            urls && urls[1] && (urls[1] as any).url
              ? (urls[1] as any).url
              : null,

          competences_ids,
          job_id,
          typeFormation,
          dureeFormation,
          softskills_ids,
          entreprise_id: entre._id,
          num: await getNextSequenceValue("offers")
        };

        new OfferModel(model)
          .save()
          .then(() => {
            OfferModel.aggregate(pipeline(_id))
              .then(async offers => {
                OfferModel.createMapping(function (err, mapping) {
                  if (err) {
                    console.log(
                      "error creating mapping (you can safely ignore this)"
                    );
                    console.log(err);
                  } else {
                    console.log("mapping created!");

                    var stream = OfferModel.synchronize();
                    var count = 0;

                    stream.on("data", function (err, doc) {
                      count++;
                    });
                    stream.on("close", function () {
                      console.log(
                        "[ElasticSearch] Indexed " + count + " " + " documents!"
                      );
                    });
                    stream.on("error", function (err) {
                      console.log("mongoosastic ERROR");
                      console.log(err);
                    });
                  }
                });
                resolve(offers[0]);
              })
              .catch(err => reject(err));
          })

          .catch(err => reject(err));
      });
    });
  });
