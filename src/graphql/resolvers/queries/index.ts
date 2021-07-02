import admin from "./admin";
import candidat from "./candidat";
import applications from "./application";
import entreprise from "./entreprise";
import offer from "./offer";
import job from "./job";
import email from "./email";
import competence from "./competence";
import user from "./users";
import settings from "./settings";
import actualité from "./actualité";
import annotation from "./annotation";
import softskill from "./softskill"
export default {
	...admin,
	...candidat,
	...entreprise,
	...applications,
	...offer,
	...job,
	...email,
	...competence,
	...user,
	...settings,
	...actualité,
	...annotation,
	...softskill
};
