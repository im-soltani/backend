import {
  ApplicationModel,
  CandidatModel,
  UserModel,
  OfferModel,
} from "../../../../models";
import mailer from "../../../../../common/mailer";

export default (_, { id, state }) => {
  return ApplicationModel.findById(id).then(async (applicationd) => {
    if (!applicationd) {
      return null;
    } else {
      return CandidatModel.findById((applicationd as any).candidat_id).then(
        (candidat) => {
          return UserModel.findById((candidat as any).uid).then((user) => {
            return OfferModel.findById((applicationd as any).offer_id).then(
              (offer) => {
                let template = "refuse_application_candidat";
                if (state === "REFUSED")
                  mailer({
                    template: template,
                    footer: true,
                    from: '"BoostMyJob"<contact@boostmyjob.com>',
                    to: (user as any).email,
                    subject: "Changement de statut d'une candidature",
                    vars: {
                      prenom_candidat: candidat.first_name,
                      nom_candidat: candidat.last_name,
                      num: (applicationd as any).num,
                      num_offre: offer.num,
                      nom_offre: offer.name,
                    },
                  });
                return applicationd;
              }
            );
          });
        }
      );
    }
  });
};
