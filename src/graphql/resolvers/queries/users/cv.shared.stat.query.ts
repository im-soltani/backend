import { CandidatModel, EntrepriseModel } from "../../../../models";
import { Types } from "mongoose";
export default (_, __, { user: { _id } }) => {
  let entreprisesName = [];

  return EntrepriseModel.find({})
    .then(async entreprisesa => {
      return Promise.all(
        entreprisesa.map(async entreprise => {
          return new Promise((resolve, reject) => {
            return CandidatModel.find({
              sharedcv: true,
              entreprises: {
                $elemMatch: {
                  id: Types.ObjectId((entreprise as any).uid[0]),
                  sharedcv: true
                }
              }
            })
              .then(async candidats => {
                entreprisesName.push({
                  name: entreprise.name,
                  nombre: candidats.length
                });

                resolve(entreprisesName);
              })
              .catch(err => console.log(err));
          });
        })
      ).then(cons => {
        return cons[(cons as any).length - 1];
      });
    })
    .catch(err => console.log(err));
};
