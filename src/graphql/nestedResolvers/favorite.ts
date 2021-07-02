import { OfferModel, EntrepriseModel } from "../../models";
export default {
	id: _ => _._id,
	offer: _ => OfferModel.findById({ _id: _.offer_id }),
	entreprise: _ =>
		OfferModel.findById({ _id: _.offer_id }).then(offer => {
			if (offer)
				return EntrepriseModel.findById({ _id: offer.entreprise_id }).then(entre => {
					return entre;
				});
			else return null;
		})
};
