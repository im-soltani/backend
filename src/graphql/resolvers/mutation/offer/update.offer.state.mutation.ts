import { Types } from "mongoose";
import { OfferModel } from "../../../../models";
import mailer from "../../../../../common/mailer";

const pipeline = (id) => [
  { $match: { _id: Types.ObjectId(id) } },
  {
    $lookup: {
      from: "entreprises",
      as: "entreprise",
      localField: "entreprise_id",
      foreignField: "_id",
    },
  },
  { $unwind: "$entreprise" },
  {
    $lookup: {
      from: "users",
      as: "entreprise.profile",
      localField: "entreprise.uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$entreprise.profile" },
];

export default (_, { id, state }) => {
  return OfferModel.findById(id).then(async (offer) => {
    if (!offer) {
      return null;
    } else {
      if (!(offer as any).state !== state) {
        (offer as any).state = state;
        if (state === "PUBLISHED") (offer as any).publishedAt = new Date();
        await offer.save();
      }
      OfferModel.createMapping(function (err, mapping) {
        if (err) {
          console.log(err);
        } else {
          var stream = OfferModel.synchronize();
          var count = 0;

          stream.on("data", function (err, doc) {
            count++;
          });
          stream.on("close", function () {});
          stream.on("error", function (err) {
            console.log(err);
          });
        }
      });
      return OfferModel.aggregate(pipeline(id)).then((offers) => {
        const offer = offers[0];
        if (state === "ON_HOLD_BY_ADMIN")
          mailer({
            template: "hold_offer_admin",
            footer: true,
            from: '"BoostMyJob"<contact@boostmyjob.com>',
            to: offer.entreprise.profile.email,
            subject: "Suspention d'une offre",
            vars: {
              name: offer.entreprise.name,
              offer_num: offer.num,
              offer_name: offer.name,
            },
          });
        OfferModel.createMapping(function (err, mapping) {
          if (err) {
            console.log("error creating mapping (you can safely ignore this)");
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
    }
  });
};
