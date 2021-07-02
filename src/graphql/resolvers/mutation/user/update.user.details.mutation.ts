import { UserModel } from "../../../../models";

export default (_, { id, input: { password } }) =>
  UserModel.findById(id).then(async user => {
    if (!user) {
      return user;
    }
    if (!(user as any).isValidPassword(password)) {
      (user as any).password = await (UserModel as any).hashPassword(password);
    }
    return user.save();
  });
