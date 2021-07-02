import { Types } from 'mongoose';
import { CompetenceModel } from '../../../../models';

const pipeline = (id) => [ { $match: { _id: Types.ObjectId(id) } } ];

export default (_, { id }, { user: { _id } }) =>
CompetenceModel.aggregate(pipeline(id)).then((competences) => (competences.length ? competences[0] : null));
