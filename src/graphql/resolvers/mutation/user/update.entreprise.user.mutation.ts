import { Types } from "mongoose";

import { UserModel } from "../../../../models";

const pipeline = _id => [
  { $match: { _id: Types.ObjectId(_id) } },
];

export default (
  _,
  {
    id,
    input: {
      profileEmail,
      profileName,
      profilePrenom,
    }
  }
) =>
    UserModel.findById(id).then(async user => {
      if (!user) {
        return null;
      } else {
          (user as any).email = profileEmail;
          (user as any).name = profileName;
          (user as any).prenom = profilePrenom;
          return user.save().then(updatedUser => {
            return UserModel.aggregate(pipeline(updatedUser.id)).then(
              updatedUser => updatedUser[0]
            );
          });

      }
    });
