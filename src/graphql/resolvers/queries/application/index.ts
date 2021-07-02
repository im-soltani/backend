import getApplication from "./application.query";
import getApplications from "./applications.query";
import getApplicationsByState from "./applicationsByState";
import getApplicationByNum from "./application.by.num.query";
import getApplicationsStatByWeekEnterprise from "./applications.by.week.entreprise.query";
import getAcceptedApplicationsStatByWeek from "./accepted.applications.by.week.query";
import getApplicationsStatByWeek from "./applications.by.week.query";
import getPendingApplication from "./applications.pending";
import getAssociatedApplication from "./application.associated.to.formation";
import getApplicationsByAdherent from "./applications.stats";
export default {
	getApplication,
	getApplicationByNum,
	getApplications,
	getApplicationsByState,
	getApplicationsStatByWeekEnterprise,
	getAcceptedApplicationsStatByWeek,
	getApplicationsStatByWeek,
	getPendingApplication,
	getAssociatedApplication,
	getApplicationsByAdherent
};
