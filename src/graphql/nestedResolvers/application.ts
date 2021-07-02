import { CandidatModel, EntrepriseModel, OfferModel } from "../../models";

export default {
  id: _ => _._id,
  candidat: _ => CandidatModel.findById(_.candidat_id),
  entreprise: _ => EntrepriseModel.findById(_.entreprise_id),
  offer: _ => OfferModel.findById({ _id: _.offer_id })
};
