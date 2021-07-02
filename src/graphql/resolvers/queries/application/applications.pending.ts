import { ApplicationModel, EntrepriseModel } from "../../../../models";
const pipelineAll = (entreprise_id) => [
  {
    $match: {
      entreprise_id: entreprise_id,
      state: "PENDING",
    },
  },
  {
    $lookup: {
      from: "offers",
      as: "offer",
      localField: "offer_id",
      foreignField: "_id",
    },
  },
];
export default (_, __, { user: { _id } }) =>
  EntrepriseModel.findOne({ uid: _id }).then((entreprise) => {
    return ApplicationModel.aggregate(pipelineAll(entreprise._id)).then(
      (application) => {
        let x = 0;
        application.map((val) => {
          if (val.offer[0].state != "DELETED") x = x + 1;
        });
        return x;
      }
    );
  });
