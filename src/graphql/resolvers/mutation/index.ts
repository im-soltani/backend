import application from "./application";
import user from "./user";
import offer from "./offer";
import job from "./job";
import email from "./email";
import competence from "./competence";
import settings from "./settings";
import actualite from "./actualite";
import annotation from "./annotation";
import softskill from "./softskill";
export default {
	...user,
	...application,
	...offer,
	...job,
	...email,
	...competence,
	...settings,
	...actualite,
	...annotation,
	...softskill
};
