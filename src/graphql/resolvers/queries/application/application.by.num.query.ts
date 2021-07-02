import { Types } from "mongoose";
import { ApplicationModel } from "../../../../models";

const pipeline = ({ num, _id }) => {
	return [
		{
			$match: {
				num: num,
				entreprise_id: Types.ObjectId(_id)
			}
		}
	];
};

export default async (_, { num }, { user: { profile: { _id } } }) =>
	ApplicationModel.aggregate(
		pipeline({
			num,
			_id
		})
	).then(applications => applications[0]);
