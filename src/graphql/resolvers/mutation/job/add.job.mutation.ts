import { JobModel } from "../../../../models";

export default async (
  _,
  { data },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  new Promise(async (resolve, reject) => {
    JobModel.create(data, { oneOperation: true })
      .then(jobs => {
        const job = jobs[0];

        resolve(job);
      })
      .catch(err => {
        reject(err);
      });
  });
