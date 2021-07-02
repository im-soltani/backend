import { Types } from "mongoose";
import { ApplicationModel, OfferModel } from "../../../../models";

const pipeline = ({ id, skip, limit }) => {
	return [
		{ $match: { offer_id: Types.ObjectId(id), state: "ACCEPTED" } },
		{ $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
		{ $unwind: "$candidat" },
		{ $sort: { createdAt: -1 } },
		{ $skip: skip ? skip : 0 },
		{ $limit: limit ? limit : 5 }
	];
};

const AllPipeline = ({ id }) => {
	return [
		{ $match: { offer_id: Types.ObjectId(id) } },
		{ $lookup: { from: "candidats", as: "candidat", localField: "candidat_id", foreignField: "_id" } },
		{ $unwind: "$candidat" },
		{ $sort: { createdAt: -1 } }
	];
};

export default (_, { skip, limit, num }) =>
	OfferModel.find({ num: num }).then(offer => {
		return ApplicationModel.aggregate(AllPipeline({ id: offer[0]._id })).then(totals => {
			return ApplicationModel.aggregate(pipeline({ id: offer[0]._id, skip, limit })).then(applications => {
				return {
					applications: applications,
					totalCount: totals.length
				};
			});
		});
	});
