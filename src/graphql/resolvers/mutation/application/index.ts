import addApplicationByEntreprise from "./add.application.mutation.by.entreprise";
import addApplicationByCandidat from "./add.application.mutation.by.candidat";
import updateApplication from "./update.application.mutation";
import updateApplicationState from "./update.application.state.mutation";
import sendApplicationEmail from "./send.application.email.mutation";

export default {
  addApplicationByEntreprise,
  addApplicationByCandidat,
  updateApplication,
  updateApplicationState,
  sendApplicationEmail
};
