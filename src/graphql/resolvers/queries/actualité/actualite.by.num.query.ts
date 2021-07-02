import { ActualiteModel } from "../../../../models";

const pipeline = num => [
	{ $match: { num: num } },
	{
		$lookup: {
			from: "entreprises",
			as: "entreprise",
			localField: "entreprise_id",
			foreignField: "_id"
		}
	},
	{ $unwind: "$entreprise" }
];

export default (_, { num }) => {
	return ActualiteModel.aggregate(pipeline(num)).then(Actualite => {
		return Actualite[0];
	});
};
