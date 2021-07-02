"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_admin_mutation_1 = require("./add.admin.mutation");
const add_candidat_mutation_1 = require("./add.candidat.mutation");
const add_entreprise_holiday_mutation_1 = require("./add.entreprise.holiday.mutation");
const add_entreprise_mutation_1 = require("./add.entreprise.mutation");
const block_user_mutation_1 = require("./block.user.mutation");
const change_avatar_mutation_1 = require("./change.avatar.mutation");
const change_candidat_address_mutation_1 = require("./change.candidat.address.mutation");
const change_password_mutation_1 = require("./change.password.mutation");
const change_user_avatar_mutation_1 = require("./change.user.avatar.mutation");
const remove_entreprise_holiday_mutation_1 = require("./remove.entreprise.holiday.mutation");
const unblock_user_mutation_1 = require("./unblock.user.mutation");
const update_candidat_details_mutation_1 = require("./update.candidat.details.mutation");
const update_entreprise_details_mutation_1 = require("./update.entreprise.details.mutation");
const update_entreprise_mutation_1 = require("./update.entreprise.mutation");
const update_user_details_mutation_1 = require("./update.user.details.mutation");
exports.default = {
  addAdmin: add_admin_mutation_1.default,
  addCandidat: add_candidat_mutation_1.default,
  addEntreprise: add_entreprise_mutation_1.default,
  blockUser: block_user_mutation_1.default,
  unblockUser: unblock_user_mutation_1.default,
  changePassword: change_password_mutation_1.default,
  changeAvatar: change_avatar_mutation_1.default,
  changeUserAvatar: change_user_avatar_mutation_1.default,

  updateUserDetails: update_user_details_mutation_1.default,
  updateCandidatDetails: update_candidat_details_mutation_1.default,
  updateEntrepriseDetails: update_entreprise_details_mutation_1.default,
  updateEntreprise: update_entreprise_mutation_1.default,
  addEntrepriseWorkHoliday: add_entreprise_holiday_mutation_1.default,
  removeEntrepriseWorkHoliday: remove_entreprise_holiday_mutation_1.default
};
//# sourceMappingURL=index.js.map
