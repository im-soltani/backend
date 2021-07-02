import { Types } from "mongoose";
import { EmailModel } from "../../../../models";

const pipeline = id => [{ $match: { _id: Types.ObjectId(id) } }];

export default (_, { id }, { user: { _id } }) =>
  EmailModel.aggregate(pipeline(id)).then(emails =>
    emails.length ? emails[0] : null
  );
