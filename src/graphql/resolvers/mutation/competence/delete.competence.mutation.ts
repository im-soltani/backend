import { CompetenceModel, OfferModel } from "../../../../models";
import { Types } from "mongoose";

const pipeline = id => [
  { $match: { competences_ids: { $in: [Types.ObjectId(id)] } } }
];

export default (
  _,
  { id },
  {
    user: {
      profile: { _id }
    }
  }
) => {
  return OfferModel.aggregate(pipeline(id)).then(async offers => {
    if (offers.length === 0) {
      return CompetenceModel.deleteOne({ _id: id }).then(res => {
        return "La compétence a été supprimée avec succès";
      });
    } else {
      return "Vous ne pouvez pas supprimer cette compétence car elle est utilisée dans le système.";
    }
  });
};
