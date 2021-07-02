import { UserModel } from "../../models";

export default {
  id: (_) => _._id,
  profile: (_) => UserModel.findById(_.uid),
  profile_pic_url: (_) =>
    !_.profile_pic_url
      ? _.profile_pic_url
      : `https://api.boostmyjob.com${_.profile_pic_url}`,
};
