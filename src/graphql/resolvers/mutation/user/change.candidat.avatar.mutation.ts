import { createWriteStream } from "fs";
import { Types } from "mongoose";
import { CandidatModel } from "../../../../models";

export default (_, { file }, { user: { _id } }) => {
  let filter = { uid: Types.ObjectId(_id) };
  return CandidatModel.findOne(filter).then(user => {
    if (!user) {
      return false;
    }
    return new Promise(async (resolve, reject) => {
      const filename = `${Date.now()}.jpg`;
      const path = `uploads/avatars/${filename}`;
      const { stream } = await file;
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => {
          (user as any).profile_pic_url = `/media/avatars/${filename}`;
          return user.save().then(() => resolve(true));
        })
        .on("error", err => reject(err));
    });
  });
};
