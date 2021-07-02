import { EntrepriseModel } from "../../../../models";

const pipeline = (filter) => [
  { $match: filter },
];

export default (_, { search, status }, { user: { } }) => {
  const filter = search
    ? {
      ent_type: status,
      $or: [{ name: search }]
    }
    : {
      ent_type: status
    };
  return EntrepriseModel.aggregate(pipeline(filter)).then(
    totals => {
      let arr = [];
      totals.map(val => {
        arr.push({
          id: val._id,
          name: val.name,
        })
      })
      return {
        entreprises: arr,
        totalCount: arr.length
      };
    }
  );
};
