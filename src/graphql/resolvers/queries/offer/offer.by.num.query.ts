import { OfferModel } from "../../../../models";

const pipeline = ({ num }) => {
  return [
    {
      $match: {
        num: num
      }
    },
  ];
};

export default async (_, { num }, { user: { } }) =>
  OfferModel.aggregate(
    pipeline({
      num,
    })
  ).then(offers => {
    return offers[0];
  });
