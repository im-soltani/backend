import getEntreprises from "./entreprises.query";
import getEntreprise from "./entreprise.query";
import getEntrepriseByNum from "./entreprise.by.num.query";
import getEntrepriseProfile from "./entreprise.profile.query";
import getEntrepriseAutocomplete from "./entreprise_autocomplete.query";
import getEntrepriseUsers from "./entreprise.users.query";
export default {
  getEntreprise,
  getEntreprises,
  getEntrepriseByNum,
  getEntrepriseProfile,
  getEntrepriseAutocomplete,
  getEntrepriseUsers
};
