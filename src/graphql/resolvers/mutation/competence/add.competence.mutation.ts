import { CompetenceModel } from "../../../../models";

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
    CompetenceModel.create(data, { oneOperation: true })
      .then(competences => {
        const competence = competences[0];

        resolve(competence);
      })
      .catch(err => {
        reject(err);
      });
  });
