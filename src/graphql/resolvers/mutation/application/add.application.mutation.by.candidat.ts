import {
  CandidatModel,
  ApplicationModel,
  EntrepriseModel,
  OfferModel,
} from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";
import mailer from "../../../../../common/mailer";

export default (
  _,
  { offer_id, entreprise_id, letter },
  { user: { _id, email } }
) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findOne({ uid: _id }).then(async (candidat) => {
      if (!candidat) resolve(false);
      if (letter) {
        candidat.letter = letter;
        candidat.save();
      }
      return ApplicationModel.find({
        candidat_id: candidat._id,
        offer_id: offer_id,
      }).then((applicationsa) => {
        if (applicationsa.length > 0) {
          resolve(false);
        } else {
          return OfferModel.findOne({ _id: offer_id }).then((offer) => {
            if (!offer) {
              resolve(false);
            } else {
              return EntrepriseModel.findOne({ _id: entreprise_id })
                .then(async (entreprise) => {
                  let num = await getNextSequenceValue("applications");
                  new ApplicationModel({
                    num: num,
                    state: "PENDING",
                    entreprise_id: entreprise._id,
                    profile:
                      candidat.jobs &&
                      candidat.jobs.length > 0 &&
                      candidat.jobs[0],
                    description: "Faite par le candidat",
                    disponibility:
                      candidat.disponibility && candidat.disponibility,
                    experience: candidat.experience && candidat.experience,
                    offer_id,
                    candidat_id: candidat._id,
                  })
                    .save()
                    .then(() => {
                      mailer({
                        template: "send_application_candidat",
                        footer: true,
                        from: '"BoostMyJob"<contact@boostmyjob.com>',
                        to: email,
                        subject: "Envoie de candidature",
                        vars: {
                          first_name: candidat.first_name,
                          last_name: candidat.last_name,
                          num: num,
                          offer_num: offer.num,
                          offer_name: offer.name,
                        },
                      });
                      return resolve(true);
                    })
                    .catch((err) => {
                      console.log("1", err);
                      reject(err);
                    });
                })
                .catch((err) => {
                  console.log("2", err);
                  reject(err);
                });
            }
          });
        }
      });
    });
  });
