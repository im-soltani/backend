import { CandidatModel, EntrepriseModel } from "../../../../models";
import { Types } from "mongoose";
import mailer from "../../../../../common/mailer";
const pipeline = (id) => [
  { $match: { _id: Types.ObjectId(id) } },
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
  { id, sharedcv, recieved, rating },
  { user: { _id, role } }
) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findById(id).then((candidat) => {
      return EntrepriseModel.findOne({ uid: { $in: [_id] } }).then((data) => {
        let entreprises = [];
        candidat.entreprises.map((entreprise) => {
          let entre = entreprise;
          if (entreprise.id.toString() === _id.toString()) {
            entre.sharedcv = sharedcv;
            entre.img_url = (data as any).profile_pic_url;
            entre.recieved = recieved;
            entre.rating = rating;
          }
          entreprises.push(entre);
        });
        let ratingz = 0;
        if (entreprises) {
          entreprises.map((ele) => {
            ratingz = ele.rating + ratingz;
          });

          candidat.note = Math.trunc(ratingz / entreprises.length);
        } else candidat.note = ratingz;
        candidat.entreprises = entreprises;
        candidat.sharedby =
          role === "ADMIN"
            ? "Diffusés par l'équipe DL"
            : "Partagés par les adhérents";

        candidat.sharedcv = role === "ADMIN" ? true : false;
        candidat.sharedAt = new Date();
        candidat.save().then(() => {
          candidat.on("es-indexed", function (err, res) {
            if (err) throw err;
          });
          CandidatModel.aggregate(pipeline(id))
            .then(async (candidats) => {
              mailer({
                template: "share_request",
                footer: true,
                from: '"BoostMyJob"<contact@boostmyjob.com>',
                to: candidats[0].profile.email,
                subject: "Demande de partage du CV",
                vars: {
                  name: data.name,
                  last_name: candidats[0].last_name,
                  first_name: candidats[0].first_name,
                },
              });
              resolve(candidats[0]);
            })
            .catch((err) => reject(err));
        });
      });
    });
  });
