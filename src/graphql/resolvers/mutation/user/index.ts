import acceptShareCandidat from "./accept.share.candidat";
import addAdmin from "./add.admin.mutation";
import addCandidatByEntreprise from "./add.candidat.by.entreprise.mutation";
import addCandidat from "./add.candidat.mutation";
import addCV from "./add.cv.mutation";
import addEcole from "./add.ecole.mutation";
import addEntrepriseWorkHoliday from "./add.entreprise.holiday.mutation";
import addEntreprise from "./add.entreprise.mutation";
import addEntrepriseProfile from "./add.entreprise.profile.mutation";
import blockUser from "./block.user.mutation";
import changeAvatar from "./change.avatar.mutation";
import updateCandidatAvatar from "./change.candidat.avatar.mutation";
import updateEntrepriseBanner from "./change.entreprise.banner.mutation";
import updateEntrepriseLogo from "./change.entreprise.logo.mutation";
import changePassword from "./change.password.mutation";
import changeUserAvatar from "./change.user.avatar.mutation";
import downloadCandidatByEntreprise from "./download.candidat.by.entreprise";
import exportCandidates from "./export.candidates.mutation";
import exportEcole from "./export.ecole.mutation";
import exportEntreprises from "./export.entreprises.mutation";
import updateCandidatFavorisStatus from "./favoris.candidat.by.entreprise";
import removeCandidat from "./remove.candidat.mutation";
import removeEntreprise from "./remove.entreprise.mutation";
import removeUserFromEntreprise from "./remove.entreprise.user.mutation";
import removeUserAvatar from "./remove.user.avatar.mutation";
import shareCandidatByEntreprise from "./share.candidat.by.entreprise";
import shareMyCV from "./share.my.cv";
import shareMyCVState from "./share.my.cv.state";
import unblockUser from "./unblock.user.mutation";
import updateAdmin from "./update.admin.mutation";
import updateCandidatDetails from "./update.candidat.details.mutation";
import updateEntrepriseDetails from "./update.entreprise.details.mutation";
import updateEntreprise from "./update.entreprise.mutation";
import updateEntrepriseUser from "./update.entreprise.user.mutation";
import updateUserDetails from "./update.user.details.mutation";
import updateUserStatus from "./update.user.status";
import updateUsersStatus from "./update.users.status";
export default {
  addAdmin,
  updateAdmin,
  addCandidat,
  acceptShareCandidat,
  addEntreprise,
  addEcole,
  blockUser,
  unblockUser,
  changePassword,
  addCV,
  removeUserFromEntreprise,
  shareMyCV,
  addCandidatByEntreprise,
  updateEntrepriseBanner,
  shareCandidatByEntreprise,
  downloadCandidatByEntreprise,
  changeAvatar,
  updateEntrepriseLogo,
  updateCandidatAvatar,
  changeUserAvatar,
  removeUserAvatar,
  updateUserDetails,
  updateCandidatDetails,
  updateEntrepriseDetails,
  updateEntreprise,
  addEntrepriseWorkHoliday,
  updateUsersStatus,
  shareMyCVState,
  updateUserStatus,
  updateCandidatFavorisStatus,
  removeCandidat,
  removeEntreprise,
  addEntrepriseProfile,
  updateEntrepriseUser,
  exportCandidates,
  exportEntreprises,
  exportEcole
};