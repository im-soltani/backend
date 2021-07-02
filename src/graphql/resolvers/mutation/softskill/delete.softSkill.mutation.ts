import { SoftskillModel, OfferModel } from "../../../../models";
import { Types } from "mongoose";

const pipeline = id => [{ $match: { job_id: Types.ObjectId(id) } }];

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
      return SoftskillModel.deleteOne({ _id: id }).then(res => {
        return "Le softSkill a été supprimé avec succès";
      });
    } else {
      return "Vous ne pouvez pas supprimer ce softSkill car il est utilisé dans le système.";
    }
  });
};
