import { Types } from "mongoose";
import { AnnotationModel } from "../../../../models";
const pipeline = ({ candidate_id, entreprise_id }) => {
	let sort = { updatedAt: -1 };
	return [
		{
			$match: { entreprise_id: Types.ObjectId(entreprise_id), candidate_id: Types.ObjectId(candidate_id) }
		},
		{
			$lookup: {
				from: "entreprises",
				as: "entreprise",
				localField: "entreprise_id",
				foreignField: "_id"
			}
		},
		{ $unwind: "$entreprise" },
		{
			$lookup: {
				from: "users",
				as: "user",
				localField: "user_id",
				foreignField: "_id"
			}
		},
		{ $unwind: "$user" },
		{ $sort: sort }
	];
};

export default (_, { entreprise_id, candidate_id }) =>
	AnnotationModel.aggregate([
		pipeline({
			candidate_id,
			entreprise_id
		})
	]).then(Annotation => {
		return {
			AnnotationResult: Annotation,
			totalCount: Annotation.length
		};
	});
