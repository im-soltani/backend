import { Types } from 'mongoose';
import { SoftskillModel } from '../../../../models';

const pipeline = (id) => [{ $match: { _id: Types.ObjectId(id) } }];

export default (_, { id, name }) => {
	return SoftskillModel.findById(id).then(async (softSkill) => {
		if (!softSkill) {
			return null;
		} else {
			(softSkill as any).name = name;
			await softSkill.save();

			return SoftskillModel.aggregate(pipeline(id)).then((softskills) => {
				const softSkill = softskills[0];
				return softSkill;
			});
		}
	});
};
