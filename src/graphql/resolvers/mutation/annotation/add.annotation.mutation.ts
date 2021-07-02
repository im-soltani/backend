import { Types } from "mongoose";
import { AnnotationModel, EntrepriseModel, UserModel } from "../../../../models";
import annotation from "../../../nestedResolvers/annotation";

const pipeline = _id => [
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
			as: "entreprise.profile",
			localField: "entreprise.uid",
			foreignField: "_id"
		}
	},
	{ $unwind: "$entreprise.profile" }
];
export default (_, { input }) =>
	new Promise(async (resolve, reject) => {
		let model = {
			...input
		};
		new AnnotationModel(model)
			.save()
			.then(data => {
				resolve({ commentaire: "maleee" });
				/*AnnotationModel.aggregate(pipeline(_id))
					.then(async annotation => {
						resolve(annotation[0]);
					})
					.catch(err => reject(err));*/
			})
			.catch(err => reject(err));
	});
