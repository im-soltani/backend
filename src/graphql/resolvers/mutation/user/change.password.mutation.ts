import * as bcrypt from "bcrypt";

import { SessionModel, UserModel } from "../../../../models";

export default (_, { password, oldPassword }, { user: { _id }, token }) =>
  UserModel.findById(_id).then(user => {
    if (!(user as any).isValidPassword(oldPassword)) {
      return false;
    }
    return getHashedPassword(password).then(hash => {
      (user as any).password = hash;
      return user.save().then(() => {
        SessionModel.deleteOne({ uid: _id, token: { $ne: token } });
        return true;
      });
    });
  });

const getHashedPassword = password =>
  new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
