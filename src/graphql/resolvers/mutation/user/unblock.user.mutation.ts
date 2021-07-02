import {UserModel} from "../../../../models";

export default (_, {id}) => UserModel.findById(id).then(user => {
    if (!user) {
        return user;
    }
    (user as any).is_blocked = false;
    return user.save();
});