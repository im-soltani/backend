import { OfferModel } from "../../../../models";

const AllPipeline = ({ offreType }) => {
  let filter = {};
  filter = {
    offreType: offreType == "JOB" ? "JOB" : "EDUCATION",
  };

  if (offreType == "JOB")
    return [
      { $match: filter },
      {
        $lookup: {
          from: "entreprises",
          as: "entreprise",
          localField: "entreprise_id",
          foreignField: "_id",
        },
      },
      { $unwind: "$entreprise" },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "jobs",
          as: "job",
          localField: "job_id",
          foreignField: "_id",
        },
      },
      { $unwind: "$job" },
    ];
  else
    return [
      { $match: filter },
      {
        $lookup: {
          from: "entreprises",
          as: "entreprise",
          localField: "entreprise_id",
          foreignField: "_id",
        },
      },
      { $unwind: "$entreprise" },
    ];
};

export default (_, { offreType }, { user: {} }) =>
  OfferModel.aggregate([
    AllPipeline({
      offreType,
    }),
  ]).then((offers) => {
    const ARCHIVED = offers.filter((e) => e.state === "ARCHIVED").length;
    const PUBLISHED = offers.filter((e) => e.state === "PUBLISHED").length;
    const DELETED = offers.filter((e) => e.state === "DELETED").length;
    const ON_HOLD = offers.filter((e) => e.state === "ON_HOLD").length;
    const DRAFT = offers.filter((e) => e.state === "DRAFT").length;

    return { Count: [DRAFT, PUBLISHED, ON_HOLD, ARCHIVED, DELETED] };
  });
