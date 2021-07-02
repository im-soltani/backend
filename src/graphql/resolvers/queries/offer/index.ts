import getOfferByNum from "./offer.by.num.query";
import getOffer from "./offer.query";
import getOffersActiveStatEnterprise from "./offers.active.entreprise.query";
import getAdminOffersByState from "./offers.admin.by.state";
import getOffersByState from "./offers.by.state";
import getOffersByStateByAdmin from "./offers.by.state.by.admin";
import getOffersByStateByEntreprise from "./offers.by.state.by.entreprise";
import getOffersByStateCount from "./offers.by.state.number";
import getOffersStatByWeekEnterprise from "./offers.by.week.entreprise.query";
import getOffersStatByWeek from "./offers.by.week.query";
import getFormationByEntreprise from "./offers.formation.by.entreprise";
import getOffers from "./offers.query";
export default {
  getOffer,
  getOffers,
  getOffersByState,
  getOffersByStateByEntreprise,
  getOfferByNum,
  getOffersStatByWeekEnterprise,
  getOffersStatByWeek,
  getOffersActiveStatEnterprise,
  getAdminOffersByState,
  getFormationByEntreprise,
  getOffersByStateByAdmin,
  getOffersByStateCount,
};
