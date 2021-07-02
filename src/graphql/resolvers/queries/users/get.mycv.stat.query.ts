import { CandidatModel, UserModel } from "../../../../models";
import { Types } from "mongoose";
export default (_, { ent_type, uid }, { user: { _id } }) => {
  let candidatsStat = [];
  return UserModel.find({
    is_blocked_by_admin: false,
    is_blocked: false,
    ref: "candidats",
  })
    .then(async (users) => {
      CandidatModel.createMapping(function (err, mapping) {
        if (err) {
          console.log(err);
        } else {
          var stream = CandidatModel.synchronize();
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
      return Promise.all(
        users.map(async (user) => {
          return new Promise((resolve, reject) => {
            let filter = {};
            if (ent_type === "ecole") {
              filter = {
                entreprises: {
                  $elemMatch: { id: Types.ObjectId(_id), mycv: true },
                },
                uid: Types.ObjectId(user._id),
              };
            } else
              filter = {
                $or: [
                  {
                    entreprises: {
                      $elemMatch: { id: Types.ObjectId(_id), mycv: true },
                    },
                    uid: Types.ObjectId(user._id),
                  },
                  { sharedcv: true, uid: Types.ObjectId(user._id) },
                ],
              };
            return CandidatModel.find(filter)
              .then(async (candidats) => {
                candidatsStat.push({
                  id: user._id,
                  nombre: candidats.length,
                });
                resolve(candidatsStat);
              })
              .catch((err) => console.log(err));
          });
        })
      ).then((cons) => {
        return (cons[(cons as any).length - 1] as any).filter(
          (con) => con.nombre === 1
        ).length;
      });
    })
    .catch((err) => console.log(err));
};
