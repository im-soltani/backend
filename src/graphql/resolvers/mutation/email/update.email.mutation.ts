import { Types } from "mongoose";
import { EmailModel } from "../../../../models";

const pipeline = id => [{ $match: { _id: Types.ObjectId(id) } }];

export default (
  _,
  { id, input },
  {
    user: {
      profile: { _id }
    }
  }
) => {
  return EmailModel.findById(id).then(async email => {
    if (!email) {
      return null;
    } else {
      (email as any).template = input.template;
      (email as any).subject = input.subject;
      (email as any).name = input.name;
      await email.save();

      return EmailModel.aggregate(pipeline(id)).then(emails => {
        const email = emails[0];
        return email;
      });
    }
  });
};
