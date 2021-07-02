import { Types } from 'mongoose';
import { ApplicationModel } from '../../../../models';

const pipeline = ({ _id, role, state, skip, limit }) => {
	switch (role) {
		case 'ENTREPRISE':
			return [
				{ $match: { entreprise_id: Types.ObjectId(_id), state: state } },
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
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
		case 'CANDIDAT':
			return [
				{ $match: { candidat_id: Types.ObjectId(_id), state: state } },
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
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
		default:
			return [
				{ $match: { state: state } },
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
				{ $skip: skip ? skip : 0 },
				{ $limit: limit ? limit : 5 }
			];
	}
};

const AllPipeline = ({ _id, role, state }) => {
	switch (role) {
		case 'ENTREPRISE':
			return [
				{ $match: { entreprise_id: Types.ObjectId(_id), state: state } },
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
			];
		case 'CANDIDAT':
			return [
				{ $match: { candidat_id: Types.ObjectId(_id), state: state } },
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
			];
		default:
			return [
				{ $match: { state: state } },
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
			];
	}
};

export default (_, { state, skip, limit }, { user: { role, profile: { _id } } }) =>
	ApplicationModel.aggregate([
		AllPipeline({
			_id,
			role,
			state
		})
	]).then((totals) => {
		return ApplicationModel.aggregate([
			pipeline({
				_id,
				role,
				state,
				skip,
				limit
			})
		]).then((applications) => {
			return {
				applications: applications,
				totalCount: totals.length
			};
		});
	});
