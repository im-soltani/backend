import { Types } from "mongoose";
import { EntrepriseModel, UserModel } from "../../../../models";
const pipeline = (filter, skip, limit,uid) => [
  { $match: filter },
  { $skip: skip ? skip : 0 },
  { $limit: limit ? limit : 99 }
];
const AllPipeline = _id => [{ $match: { _id: Types.ObjectId(_id) } }];

export default (_, { search, skip, limit,id }) => {
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
  }

  return  EntrepriseModel.aggregate(AllPipeline(id)).then(obj =>
      {
        let uid= obj[0].uid.map(function(el) { return Types.ObjectId(el) });
        const filter = search
        ? { 
            $or: [{ name: search,_id: { "$in": uid }}]
          }
        : {
           _id: { "$in": uid } 
        };

        return  UserModel.aggregate(pipeline(filter, skip, limit,uid))
       .then(usersArray => {
        return {
          users: usersArray,
          totalCount: usersArray.length
        };
      }
    );})
};
