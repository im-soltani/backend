import { createWriteStream, existsSync } from "fs";
import { Types } from "mongoose";
import * as shelljs from "shelljs";
import mailer from "../../../../../common/mailer";
import { EmailModel, EntrepriseModel, UserModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";
import { synchronize } from "../../../../models/syncronize";
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

export default (_, { file, input }) => {
  return new Promise(async (resolve, reject) => {
    const filename = `${Date.now()}.jpg`;
    const path = `uploads/logos/${filename}`;
    const { stream } = await file;
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => {
        const profile_pic_url = `/media/logos/${filename}`;
        if (!existsSync("uploads/logos")) {
          shelljs.mkdir("-p", "uploads/logos");
        }
        const randomstring =
          "101024"; /* Math.random().toString(36).slice(-8) */
        return new UserModel({
          ...input,
          password: randomstring,
          ref: "entreprises",
        })
          .save()
          .then(async (user) =>
            new EntrepriseModel({
              uid: user._id,
              ent_type: "entreprises",
              ...input,
              banner: "/media/banners/banner.png",
              profile_pic_url,
              num: await getNextSequenceValue("entreprises"),
              leader: true,
              location: {
                coordinates: [
                  input.location.latitude || 0,
                  input.location.longitude || 0,
                ],
              },
            })
              .save()
              .then((entreprise) => {
                return EntrepriseModel.aggregate(pipeline(entreprise._id)).then(
                  (entreprises) => {
                    mailer({
                      template: "inscription_entreprise",
                      footer: true,
                      from: '"BoostMyJob"<contact@boostmyjob.com>',
                      to: entreprises[0].profile.email,
                      subject: "Inscription",
                      vars: {
                        email: input.email,
                        password: randomstring,
                      },
                    });
                    synchronize(EntrepriseModel);
                    new EmailModel({
                      name: "Refus d'une candidature",
                      template:
                        "<p><br><span style=\"color: rgb(0,0,0);font-size: 14px;font-family: sans-serif;\"> Votre candidature numéro {{num}} pour l'offre nommée {{nom_offre}} numéro {{num_offre}} a été refusé par l'entreprise en question.   </span><br>&nbsp;</p>",
                      subject: "Refus d'une candidature",
                      entreprise_uid: user._id,
                    }).save();
                    return resolve(entreprises[0]);
                  }
                );
              })
              .catch(async (err) => {
                await user.remove();
                throw err;
              })
          )
          .catch((err) => reject(err));
      })
      .on("error", (err) => reject(err));
  });
};
