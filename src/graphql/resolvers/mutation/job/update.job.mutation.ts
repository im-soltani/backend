import { Types } from 'mongoose';
import { JobModel } from '../../../../models';

const pipeline = (id) => [ { $match: { _id: Types.ObjectId(id) } } ];

export default (_, { id, name }) => {
	return JobModel.findById(id).then(async (job) => {
		if (!job) {
			return null;
		} else {
			(job as any).name = name;
			await job.save();

			return JobModel.aggregate(pipeline(id)).then((jobs) => {
				const job = jobs[0];
				return job;
			});
		}
	});
};
