import { Types } from 'mongoose';
import { ApplicationModel } from '../../../../models';

const pipeline = ({ _id, role, skip, limit }) => {
	switch (role) {
		case 'ENTREPRISE':
			return [
				{ $match: { entreprise_id: Types.ObjectId(_id) } },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },
				{ $sort: { createdAt: -1 } },
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
		case 'CANDIDAT':
			return [
				{ $match: { candidat_id: Types.ObjectId(_id) } },
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },
				{ $sort: { createdAt: -1 } },
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
		default:
			return [
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },
				{ $sort: { createdAt: -1 } },
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
	}
};

const AllPipeline = ({ _id, role }) => {
	switch (role) {
		case 'ENTREPRISE':
			return [
				{ $match: { entreprise_id: Types.ObjectId(_id) } },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },
				{ $sort: { createdAt: -1 } }
			];
		case 'CANDIDAT':
			return [
				{ $match: { candidat_id: Types.ObjectId(_id) } },
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },
				{ $sort: { createdAt: -1 } }
			];
		default:
			return [
				{ $lookup: { from: 'candidats', as: 'candidat', localField: 'candidat_id', foreignField: '_id' } },
				{ $unwind: '$candidat' },
				{
					$lookup: { from: 'entreprises', as: 'entreprise', localField: 'entreprise_id', foreignField: '_id' }
				},
				{ $unwind: '$entreprise' },
				{
					$lookup: { from: 'offers', as: 'offer', localField: 'offer_id', foreignField: '_id' }
				},
				{ $unwind: '$offer' },

				{ $sort: { createdAt: -1 } }
			];
	}
};

export default (_, { skip, limit }, { user: { role, profile: { _id } } }) =>
	ApplicationModel.aggregate(AllPipeline({ _id, role })).then((totals) => {
		return ApplicationModel.aggregate(pipeline({ _id, role, skip, limit })).then((applications) => {
			return {
				applications: applications,
				totalCount: totals.length
			};
		});
	});
