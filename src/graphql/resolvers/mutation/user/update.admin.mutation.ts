import { AdminModel, UserModel } from "../../../../models";
import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";
import { Types } from "mongoose";
const pipeline = id => [
  { $match: { _id: Types.ObjectId(id) } },
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$profile" }
];

export default (
  _,
  { id, file, input: { email, password, first_name, last_name } }
) =>
  new Promise(async (resolve, reject) => {
    const filename = `${Date.now()}.pdf`;
    const path = `uploads/avatars/${filename}`;
    if (!existsSync("uploads/avatars")) {
      shelljs.mkdir("-p", "uploads/avatars");
    }
    if (file) {
      const { stream } = await file;

      stream.pipe(createWriteStream(path)).on("finish", () => {
        const profile_pic_url = `/media/avatars/${filename}`;

        AdminModel.findById(id).then(admin => {
          (admin as any).first_name = first_name;
          (admin as any).last_name = last_name;
          (admin as any).profile_pic_url = profile_pic_url;
          admin.save().then(() => {
            UserModel.findById((admin as any).uid).then(user => {
              (user as any).email = email;
              (user as any).password = password;
              user
                .save()
                .then(() =>
                  AdminModel.aggregate(pipeline(id)).then(admins =>
                    resolve(admins[0])
                  )
                );
            });
          });
        });
      });
    } else {
      AdminModel.findById(id).then(admin => {
        (admin as any).first_name = first_name;
        (admin as any).last_name = last_name;
        admin.save().then(() => {
          UserModel.findById((admin as any).uid).then(user => {
            (user as any).email = email;
            (user as any).password = password;
            user
              .save()
              .then(() =>
                AdminModel.aggregate(pipeline(id)).then(admins =>
                  resolve(admins[0])
                )
              );
          });
        });
      });
    }
  });
