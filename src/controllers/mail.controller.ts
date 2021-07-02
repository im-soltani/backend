import mailer from "../../common/mailer";
import { CandidatModel, UserModel, EntrepriseModel } from "../models";
import { Types } from "mongoose";
const sendMail = (req, res, next) => {
  const user = req.user;
  const {
    subject,
    body,
    id,
    refus,
    email,
    offer_name,
    offer_num,
    num
  } = req.body;
  if (!subject || !body || !id) {
    return res.sendStatus(422);
  }
  return EntrepriseModel.findOne({
    uid: { $in: [Types.ObjectId(user._id)] }
  }).then(entreprise => {
    return CandidatModel.findById(id).then(candidat => {
      if (!candidat) {
        return res.sendStatus(422);
      } else {
        return UserModel.findById(candidat.uid).then(user => {
          let str = body;
          if (refus) {
            str = str.replace("{{prenom}}", candidat.first_name);
            str = str.replace("{{nom}}", candidat.last_name);
            str = str.replace("{{num}}", num);
            str = str.replace("{{nom_offre}}", offer_name);
            str = str.replace("{{num_offre}}", offer_num);
          }

          const data = {
            email: (user as any).email,
            first_name: candidat.first_name,
            last_name: candidat.last_name,
            subject
          };
          mailer(
            {
              template: refus ? "refus_perso" : "demande",
              footer: true,
              to: data.email,
              from: `"${entreprise.name}"<${email}>`,
              subject: data.subject,
              vars: {
                subject: data.subject,
                first_name: data.first_name,
                last_name: data.last_name,
                message: str
              }
            },
            function(err, info) {
              res.send({ err, info });
            }
          );
        });
      }
    });
  });
};

export const MailController = {
  sendMail
};
