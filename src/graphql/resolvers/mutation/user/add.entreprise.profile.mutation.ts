import { Types } from "mongoose";

import mailer from "../../../../../common/mailer";
import { EntrepriseModel, UserModel, EmailModel } from "../../../../models";

const pipeline = (id) => [{ $match: { _id: Types.ObjectId(id) } }];

export default (_, { input }) => {
  return new Promise(async (resolve, reject) => {
    EntrepriseModel.aggregate(pipeline(input.leaderUid)).then(
      (entrepriseinfo) => {
        const randomstring =
          "101024"; /* Math.random().toString(36).slice(-8) */
        return new UserModel({
          email: input.email,
          ref: "entreprises",
          password: randomstring,
          name: input.name,
          prenom: input.prenom,
          isleader: false,
        })
          .save()
          .then(async (user) => {
            EntrepriseModel.update(
              { _id: Types.ObjectId(input.leaderUid) },
              { $push: { uid: Types.ObjectId(user._id) } }
            )
              .then((entrepriseUpdated) => {
                mailer({
                  template: "inscription_entreprise",
                  footer: true,
                  from: '"BoostMyJob"<contact@boostmyjob.com>',
                  to: input.email,
                  subject: "Inscription",
                  vars: {
                    email: input.email,
                    password: randomstring,
                  },
                });
                new EmailModel({
                  name: "Refus d'une candidature",
                  template:
                    "<p><br><span style=\"color: rgb(0,0,0);font-size: 14px;font-family: sans-serif;\"> Votre candidature numéro {{num}} pour l'offre nommée {{nom_offre}} numéro {{num_offre}} a été refusé par l'entreprise en question.   </span><br>&nbsp;</p>",
                  subject: "Refus d'une candidature",
                  entreprise_uid: user._id,
                }).save();
                return resolve({ name: input.name });
              })
              .catch(async (err) => {
                await user.remove();
                throw err;
              });
          })
          .catch((err) => reject(err));
      }
    );
  });
};
