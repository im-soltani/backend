import { Types } from "mongoose";
import { ActualiteModel, EntrepriseModel } from "../../../../models";
import { getNextSequenceValue } from "../../../../models/counter.model";

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
export default (_, { input }, { user: { _id } }) =>
	new Promise(async (resolve, reject) => {
		let filtre = input.auteurId
			? {
				_id: Types.ObjectId(input.auteurId)
			}
			: {
				uid: _id
			};
		EntrepriseModel.findOne(filtre).then(async entre => {
			let model = {
				...input,
				ent_type: entre.ent_type,
				entreprise_id: entre._id,
				num: await getNextSequenceValue("actualites")
			};
			new ActualiteModel(model)
				.save()
				.then(() => {
					ActualiteModel.aggregate(pipeline(_id))
						.then(async actualites => {
							ActualiteModel.createMapping(function (err, mapping) {
								if (err) {
									console.log(
										"error creating mapping (you can safely ignore this)"
									);
									console.log(err);
								} else {
									console.log("mapping created!");

									var stream = ActualiteModel.synchronize();
									var count = 0;

									stream.on("data", function (err, doc) {
										count++;
									});
									stream.on("close", function () {
										console.log(
											"[ElasticSearch] Indexed " + count + " " + " documents!"
										);
									});
									stream.on("error", function (err) {
										console.log("mongoosastic ERROR");
										console.log(err);
									});
								}
							});
							resolve(actualites[0]);
						})
						.catch(err => reject(err));
				})
				.catch(err => reject(err));
		});
	});
