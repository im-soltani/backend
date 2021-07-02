import { UserModel, EntrepriseModel } from "../../../../models";

export default (
  _,
  { num, id },
  {
    user: {
      role,
      profile: { _id }
    }
  }
) => {
  return EntrepriseModel.findOne({ num: num }).then(entreprise => {
    if (!entreprise) {
      return false;
    } else {
      const index = (entreprise as any).uid.indexOf(id);
      if (index > -1) {
        (entreprise as any).uid.splice(index, 1);
        UserModel.deleteOne({ _id: id });
      }
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
};
