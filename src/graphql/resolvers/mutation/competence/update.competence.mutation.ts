import { Types } from 'mongoose';
import { CompetenceModel } from '../../../../models';

const pipeline = (id) => [ { $match: { _id: Types.ObjectId(id) } } ];

export default (_, { id, name }) => {
	return CompetenceModel.findById(id).then(async (competence) => {
		if (!competence) {
			return null;
		} else {
			(competence as any).name = name;
			await competence.save();

			return CompetenceModel.aggregate(pipeline(id)).then((competences) => {
				const competence = competences[0];
				return competence;
			});
		}
	});
};
