import { OfferModel, UserModel } from "../../models";

export default {
  id: (_) => _._id,

  profile_pic_url: (_) =>
    !_.profile_pic_url
      ? "https://api.boostmyjob.com/media/logos/logo.png"
      : `https://api.boostmyjob.com${_.profile_pic_url}`,
  banner: (_) =>
    !_.banner
      ? "https://api.boostmyjob.com/media/banners/banner.png"
      : `https://api.boostmyjob.com${_.banner}`,
  published_offer_number: (_) =>
    OfferModel.count({ entreprise_id: _._id, state: "PUBLISHED" }),
  users: (_) => UserModel.find({ _id: { $in: _.uid } }),
};
