import { CandidatModel, EntrepriseModel } from "../../../../models";

export default (
  _,
  {},
  {
    user: {
      role,
      profile: { _id }
    }
  }
) => {
  if (role === "CANDIDAT") {
    return CandidatModel.findById(_id).then(candidat => {
      if (!candidat) {
        return false;
      } else {
        (candidat as any).profile_pic_url = null;
        return candidat
          .save()
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    });
  } else {
    return EntrepriseModel.findById(_id).then(entreprise => {
      if (!entreprise) {
        return false;
      } else {
        (entreprise as any).profile_pic_url = null;
        return entreprise
          .save()
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    });
  }
};
