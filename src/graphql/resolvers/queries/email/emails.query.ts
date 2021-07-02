import { EmailModel } from "../../../../models";
import { Types } from "mongoose";

const pipeline = id => [{ $match: { entreprise_uid: Types.ObjectId(id) } }];

export default (_, __, { user: { _id } }) =>
  EmailModel.aggregate(pipeline(_id)).then(emails => emails);
