import { SoftskillModel } from "../../../../models";

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
    SoftskillModel.create(data, { oneOperation: true })
      .then(softskills => {
        const softskill = softskills[0];

        resolve(softskill);
      })
      .catch(err => {
        reject(err);
      });
  });
