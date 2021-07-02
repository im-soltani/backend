import { ApplicationModel } from "../../../../models";

const AllPipeline = () => {
	return [
		{
			$lookup: { from: "entreprises", as: "entreprise", localField: "entreprise_id", foreignField: "_id" }
		},
		{ $unwind: "$entreprise" }
	];
};

export default (_, __, { user: { _id } }) =>
	ApplicationModel.aggregate([ AllPipeline() ]).then(applications => {
		const entrepriseApps = applications.filter(x => x.entreprise.ent_type == "entreprises").length;
		const ecoleApps = applications.filter(x => x.entreprise.ent_type == "ecole").length;
		return [ entrepriseApps, ecoleApps ];
	});
