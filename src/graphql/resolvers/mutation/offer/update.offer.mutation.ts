import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";
import { OfferModel } from "../../../../models";
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
  { file, extra_file, job_id, id, typeFormation, dureeFormation, competences_ids, softskills_ids, input },
  { user: { _id } }
) =>
  OfferModel.findById(id).then(offer => {
    if (!offer) return null;
    return new Promise(async (resolve, reject) => {
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
        (offer as any).name = input.name;
        (offer as any).salary = input.salary;
        (offer as any).address = input.address;
        (offer as any).contract = input.contract;
        (offer as any).salary_type = input.salary_type;
        (offer as any).expiredAt = input.expiredAt;
        (offer as any).city = input.city;
        (offer as any).banner =
          urls && urls[0] && (urls[0] as any).url
            ? (urls[0] as any).url
            : (offer as any).banner;
        (offer as any).extra_file =
          urls && urls[1] && (urls[1] as any).url
            ? (urls[1] as any).url
            : (offer as any).extra_file;
        (offer as any).etude = input.etude;
        (offer as any).work_time = input.work_time;
        (offer as any).experience = input.experience;
        (offer as any).description_poste = input.description_poste;
        (offer as any).competences_ids = competences_ids;
        (offer as any).softskills_ids = softskills_ids;
        (offer as any).typeFormation = typeFormation;
        (offer as any).dureeFormation = dureeFormation;
        (offer as any).startInternsh = input.startInternsh;
        (offer as any).endInternship = input.endInternship;
        (offer as any).startApply = input.startApply;
        (offer as any).endApply = input.endApply;
        (offer as any).startEducation = input.startEducation;
        (offer as any).endEducation = input.endEducation;
        (offer as any).dureeContract = input.dureeContract;


        (offer as any).job_id = job_id;

        offer
          .save()
          .then(() => {
            OfferModel.findById(id)
              .then(offers => {
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

                resolve(offers);
              })
              .catch(err => reject(err));
          })

          .catch(err => reject(err));
      });
    });
  });
