import { JobModel, OfferModel } from "../../../../models";
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
      return JobModel.deleteOne({ _id: id }).then(res => {
        return "Le métier a été supprimé avec succès";
      });
    } else {
      return "Vous ne pouvez pas supprimer ce métier car il est utilisé dans le système.";
    }
  });
};
