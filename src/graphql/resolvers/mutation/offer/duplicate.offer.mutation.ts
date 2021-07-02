import { Types } from "mongoose";
import { OfferModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";

const pipeline = id => [
  { $match: { _id: Types.ObjectId(id) } },
  {
    $lookup: {
      from: "entreprises",
      as: "entreprise",
      localField: "entreprise_id",
      foreignField: "_id"
    }
  },
  { $unwind: "$entreprise" },
  {
    $lookup: {
      from: "users",
      as: "entreprise.profile",
      localField: "entreprise.uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$entreprise.profile" }
];

export default (_, { id }) => {
  return OfferModel.findById(id).then(async offer => {
    if (!offer) {
      return null;
    } else {
      return new OfferModel({
        num: await getNextSequenceValue("offers"),
        name: (offer as any).name + " --copie",
        entreprise_id: (offer as any).entreprise_id,
        salary: (offer as any).salary,
        address: (offer as any).address,
        contract: (offer as any).contract,
        expiredAt: (offer as any).expiredAt,
        extra_file: (offer as any).extra_file,
        city: (offer as any).city,
        etude: (offer as any).etude,
        work_time: (offer as any).work_time,
        experience: (offer as any).experience,
        description_poste: (offer as any).description_poste,
        competences_ids: (offer as any).competences_ids,
        job_id: (offer as any).job_id,
        banner: (offer as any).banner,
        startEducation: (offer as any).startEducation,
        endEducation: (offer as any).endEducation,
        startApply: (offer as any).startApply,
        endApply: (offer as any).endApply,
        startInternship: (offer as any).startInternship,
        endInternship: (offer as any).endInternship,
        typeFormation: (offer as any).typeFormation,
        offreType: (offer as any).offreType,
        dureeContract: (offer as any).dureeContract
      })
        .save()
        .then(res => {
          return OfferModel.aggregate(pipeline(res._id)).then(offers => {
            const offer = offers[0];
            OfferModel.createMapping(function (err, mapping) {
              if (err) {
                console.log(
                  "error creating mapping (you can safely ignore this)"
                );
                console.log(err);
              } else {
                console.log("mapping created!");

                var stream = OfferModel.synchronize();
                var count = 0;

                stream.on("data", function (err, doc) {
                  count++;
                });
                stream.on("close", function () {
                  console.log(
                    "[ElasticSearch] Indexed " + count + " " + " documents!"
                  );
                });
                stream.on("error", function (err) {
                  console.log("mongoosastic ERROR");
                  console.log(err);
                });
              }
            });
            return offer;
          });
        });
    }
  });
};
