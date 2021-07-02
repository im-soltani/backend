import {
  EntrepriseModel,
  JobModel,
  CompetenceModel,
  SoftskillModel,
  ApplicationModel,
  CandidatModel,
} from "../../models";

export default {
  id: (_) => _._id,
  entreprise: (_) => EntrepriseModel.findById(_.entreprise_id),
  job: (_) => JobModel.findById(_.job_id),
  banner: (_) =>
    !_.banner ? _.banner : `https://api.boostmyjob.com${_.banner}`,
  extra_file: (_) =>
    !_.extra_file ? _.extra_file : `https://api.boostmyjob.com${_.extra_file}`,
  competences: (_) => CompetenceModel.find({ _id: _.competences_ids }),
  softskills: (_) => SoftskillModel.find({ _id: _.softskills_ids }),
  jobs: (_) => JobModel.find({ _id: _.jobs_ids }),
  application_number: (_) =>
    ApplicationModel.count({ offer_id: _._id, state: "PENDING" }),
  all_application_number: (_) =>
    ApplicationModel.count({
      $and: [
        { offer_id: _._id },
        {
          $or: [
            { state: "PENDING" },
            { state: "ACCEPTED" },
            { state: "REFUSED" },
          ],
        },
      ],
    }),
  applications: (_) =>
    ApplicationModel.find({ offer_id: _._id }).then((applications) => {
      return applications.map((application) => {
        return CandidatModel.findById((application as any).candidat_id).then(
          (candidat) => {
            (application as any)["candidat"] = candidat;
            return application;
          }
        );
      });
    }),
};
