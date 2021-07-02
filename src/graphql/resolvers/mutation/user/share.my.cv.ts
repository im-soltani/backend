import { CandidatModel } from "../../../../models";

export default (_, { letter }, { user: { _id } }) =>
  new Promise(async (resolve, reject) => {
    return CandidatModel.findOne({ uid: _id }).then(candidat => {
      if (!candidat) resolve(false);
      if (candidat.sharedcv) resolve(false);

      if (letter) {
        candidat.letter = letter;
        candidat.sharedcv = true;
        candidat.sharedby = "Candidatures spontanées";
        candidat.sharedAt = new Date();
        candidat.save().then(() => {
          resolve(true);
        });
      } else {
        candidat.sharedcv = true;
        candidat.sharedby = "Candidatures spontanées";
        candidat.sharedAt = new Date();
        candidat.save().then(() => {
          resolve(true);
        });
      }
    });
  });
