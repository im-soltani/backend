import { Types } from "mongoose";

import { EmailModel } from "../../../../models";

const pipeline = _id => [{ $match: { _id: Types.ObjectId(_id) } }];

export default async (
  _,
  { input },
  {
    user: {
      profile: { _id }
    }
  }
) =>
  new Promise(async (resolve, reject) => {
    new EmailModel({
      template: input.template,
      name: input.name,
      subject: input.subject,
      entreprise_uid: _id
    })
      .save()
      .then(email => {
        EmailModel.aggregate(pipeline(email._id)).then(emails => {
          const emaill = emails[0];
          resolve(emaill);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
