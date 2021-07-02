import { createWriteStream, existsSync } from "fs";
import { Types } from "mongoose";
import * as shelljs from "shelljs";

import { UserModel } from "../../../../models";

export default (_, { file }, { user: { _id } }) => UserModel.findOne({ _id: Types.ObjectId(_id) }).then(user => {
    if (!user) {
        return false;
    }
    return new Promise(async (resolve, reject) => {
        const filename = `${Date.now()}.jpg`;
        const path = `uploads/avatars/${filename}`;
        if (!existsSync("uploads/avatars")) {
            shelljs.mkdir("-p", "uploads/avatars");
        }
        const { stream } = await file;
        stream.pipe(createWriteStream(path))
            .on("finish", () => {
                (user as any).profile_pic_url = `/media/avatars/${filename}`;
                return user.save().then(() => resolve(true));
            })
            .on("error", err => reject(err));
    });
});