import { Types } from "mongoose";
import {
  CandidatModel,
  ApplicationModel,
  EntrepriseModel,
  OfferModel,
} from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";
import mailer from "../../../../../common/mailer";
const experienceConst = [
  {
    id: 1,
    value: "ONE",
    label: "< 1 an",
  },
  {
    id: 2,
    value: "TWO",
    label: "1-3 ans",
  },
  {
    id: 3,
    value: "THREE",
    label: "3-5 ans",
  },
  {
    id: 4,
    value: "FOUR",
    label: "5-7 ans",
  },
  {
    id: 5,
    value: "FIVE",
    label: "5-10 ans",
  },
  {
    id: 6,
    value: "MORE_THAN_FIVE",
    label: "> 10 ans",
  },
];
const pipeline = (_id) => [
  { $match: { _id: Types.ObjectId(_id) } },
  {
    $lookup: {
      from: "candidats",
      as: "candidat",
      localField: "candidat_id",
      foreignField: "_id",
    },
  },
  { $unwind: "$candidat" },
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
      as: "candidat.profile",
      localField: "candidat.uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$candidat.profile" },
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

export default (_, { state, offer_id, candidat_id }, { user: { _id } }) =>
  new Promise(async (resolve, reject) => {
    return ApplicationModel.find({
      candidat_id: candidat_id,
      offer_id: offer_id,
    }).then((applicationsa) => {
      if (applicationsa.length > 0) {
        resolve({
          test: false,
          ApplicationId: applicationsa[0]._id,
        });
      } else {
        return CandidatModel.findById(candidat_id)
          .then(async (candidat) => {
            return EntrepriseModel.findOne({ uid: _id })
              .then(async (entreprise) => {
                return OfferModel.findOne({ _id: offer_id }).then(
                  async (offer) => {
                    new ApplicationModel({
                      num: await getNextSequenceValue("applications"),
                      state,
                      entreprise_id: entreprise._id,
                      profile:
                        candidat.jobs &&
                        candidat.jobs.length > 0 &&
                        candidat.jobs[0],
                      description: "Faite par l'entreprise",
                      disponibility:
                        candidat.disponibility && candidat.disponibility,

                      experience:
                        candidat.experience &&
                        experienceConst.filter(
                          (exp) => exp.value === candidat.experience
                        )[0].label,
                      offer_id,
                      candidat_id,
                    })
                      .save()
                      .then((application) =>
                        ApplicationModel.aggregate(
                          pipeline(application._id)
                        ).then((applications) => {
                          mailer({
                            template: "associate_candidat_to_offer",
                            footer: true,
                            from: '"BoostMyJob"<contact@boostmyjob.com>',
                            to: applications[0].profile.email,
                            subject: "Envoie de candidature",
                            vars: {
                              first_name: applications[0].candidat.first_name,
                              last_name: applications[0].candidat.last_name,
                              num: applications[0].num,
                              offer_num: offer.num,
                              offer_name: offer.name,
                            },
                          });
                          resolve({
                            test: true,
                            ApplicationId: null,
                          });
                        })
                      )
                      .catch((err) => {
                        reject(err);
                      });
                  }
                );
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
