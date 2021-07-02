import { JobModel } from "../../../../models";

const pipeline = (filter, skip, limit) => [
  { $match: filter },
  { $sort: { name: 1 } },
  { $skip: skip ? skip : 0 },
  { $limit: limit ? limit : 999999999 }
];
const pipelineAll = (filter) => [
  { $match: filter },
  { $sort: { name: 1 } }
];
export default (_, { search, skip, limit }, { user: {} }) => {
  if (search) {
    search = new RegExp(search.toLowerCase(), "i");
  }
  const filter = search
    ? {
        $or: [{ name: search }]
      }
    : {};
  return JobModel.aggregate(pipelineAll(filter)).then(totals => {
    if (
      (skip === 0 || skip === null || skip === undefined) &&
      (limit === 0 || limit === null || limit === undefined)
    ) {
      return {
        jobs: totals,
        totalCount: totals.length
      };
    } else
      return JobModel.aggregate(pipeline(filter, skip, limit)).then(jobs => {
        return {
          jobs: jobs,
          totalCount: totals.length
        };
      });
  });
};
