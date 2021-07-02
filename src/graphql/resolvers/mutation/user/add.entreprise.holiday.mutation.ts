import {Types} from "mongoose";
import {EntrepriseModel} from "../../../../models";

const pipeline = (id) => [
    {$match: {_id: Types.ObjectId(id)}},
    {$lookup: {from: "users", as: "profile", localField: "uid", foreignField: "_id"}},
    {$lookup: {from: "applications", as: "applications", localField: "_id", foreignField: "entreprise_id"}},
    {$lookup: {from: "conversations", as: "conversations", localField: "_id", foreignField: "entreprise_id"}},
    {$unwind: "$profile"},
];

export default async (_, {day, month}, {user: {profile: {_id, work_holidays}}}) => {
    let newHolidaysResult = [];
    if (!work_holidays) {
        newHolidaysResult.push({day, month});
    } else {
        if (await work_holidays.find(holiday => holiday.day == day && holiday.month == month)) {
            newHolidaysResult = work_holidays;
        } else {
            newHolidaysResult = [
                ...work_holidays,
                {day, month}
            ];
        }
    }
    return EntrepriseModel.updateOne({_id}, {$set: {work_holidays: newHolidaysResult}})
        .then(() => EntrepriseModel.aggregate(pipeline(_id)).then(profiles => profiles[0]));
};