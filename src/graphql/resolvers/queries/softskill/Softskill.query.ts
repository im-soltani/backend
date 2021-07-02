import { Types } from 'mongoose';
import { SoftskillModel } from '../../../../models';

const pipeline = (id) => [{ $match: { _id: Types.ObjectId(id) } }];

export default (_, { id }, { user: { _id } }) =>
	SoftskillModel.aggregate(pipeline(id)).then((softSkill) => (softSkill.length ? softSkill[0] : null));
