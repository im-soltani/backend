import { OfferModel, EntrepriseModel } from "../../../../models";

export default (_, __, { user: { _id, role } }) => {
  if (role === "ENTREPRISE")
    return EntrepriseModel.findOne({ uid: _id }).then(entreprise => {
      return OfferModel.find({
        entreprise_id: entreprise._id,
        $or: [{ state: "PUBLISHED" }, { state: "ACTIF" }]
      }).then(offers => {
        return offers.length;
      });
    });
  else
    return OfferModel.find({
      $or: [{ state: "PUBLISHED" }, { state: "ACTIF" }]
    }).then(offers => {
      return offers.length;
    });
};
