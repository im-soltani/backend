import { UserModel, EntrepriseModel, JobModel } from "../../models";
import { Types } from "mongoose";
export default {
  id: (_) => _._id,
  job_id: (_) =>
    JobModel.findOne({ name: _.jobs && _.jobs.length > 0 && _.jobs[0] }).then(
      (job) => {
        if (job) return job._id;
        else return "";
      }
    ),
  cv: (_) => (!_.cv ? _.cv : `https://api.boostmyjob.com${_.cv}`),
  cv_eng: (_) =>
    !_.cv_eng ? _.cv_eng : `https://api.boostmyjob.com${_.cv_eng}`,
  note: (_) => {
    let rating = 0;
    if (_.entreprises) {
      _.entreprises.map((ele) => {
        rating = ele.rating + rating;
      });

      return Math.trunc(rating / _.entreprises.length);
    } else return rating;
  },
  profile: (_) => UserModel.findById(_.uid),
  profile_pic_url: (_) =>
    !_.profile_pic_url
      ? _.profile_pic_url
      : `https://api.boostmyjob.com${_.profile_pic_url}`,
  requests: async (_) => {
    return Promise.all(
      _.entreprises.map(async (item) => {
        if (item.sharedcv)
          return new Promise((resolve, reject) => {
            return EntrepriseModel.find({ uid: Types.ObjectId(item.id) }).then(
              async (entreprise) => {
                resolve(entreprise);
              }
            );
          });
      })
    ).then((entres) => {
      return entres && entres.length > 0 ? entres[0] : [];
    });
  },
};
