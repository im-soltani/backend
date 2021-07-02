import { OfferModel } from "../../../../models";

const pipeline = ({ state, search, skip, limit, field, direction }) => {
	let sort = {};
	if (field && direction) {
		if (field === "name") {
			sort = { name: direction };
		} else if (field === "createdAt") {
			sort = { createdAt: direction };
		}
	} else {
		sort = { createdAt: -1 };
	}
	let filter = {};
	if (search) {
		search = new RegExp(search.toLowerCase(), "i");
		filter = {
			//	state: state,
			$or: [ { name: search } ]
		};
	} else {
		filter = {
			state: state
		};
	}
	return [
		{
			$match: filter
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
				from: "jobs",
				as: "job",
				localField: "job_id",
				foreignField: "_id"
			}
		},
		{ $unwind: "$job" },
		{ $sort: sort },
		{ $skip: skip ? skip : 0 },
		{ $limit: limit ? limit : 5 }
	];
};

export default (_, { state, search, skip, limit, field, direction }) => {
	return OfferModel.aggregate([
		pipeline({
			state,
			search,
			skip,
			limit,
			field,
			direction
		})
	]).then(offers => {
		return {
			offers: offers,
			totalCount: offers.length
		};
	});
};
