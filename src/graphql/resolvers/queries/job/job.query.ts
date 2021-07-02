import { Types } from 'mongoose';
import { JobModel } from '../../../../models';

const pipeline = (id) => [ { $match: { _id: Types.ObjectId(id) } } ];

export default (_, { id }, { user: { _id } }) =>
	JobModel.aggregate(pipeline(id)).then((jobs) => (jobs.length ? jobs[0] : null));
