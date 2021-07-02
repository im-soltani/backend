import { AdminModel, UserModel, EntrepriseModel } from "../../../../models";
import { createWriteStream, existsSync } from "fs";
import * as shelljs from "shelljs";
import { getNextSequenceValue } from "../../../../models/counter.model";
const pipeline = [
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
  { file, input: { email, password, first_name, last_name } }
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
        new UserModel({ email, password, ref: "admins" })
          .save()
          .then(async ({ _id }) =>
            new AdminModel({
              uid: _id,
              first_name,
              last_name,
              profile_pic_url,
              num: await getNextSequenceValue("admins")
            })
              .save()
              .then(() =>
                EntrepriseModel.findById("5d67d58f4b55ce7cca662014").then(
                  entreprise => {
                    entreprise.uid.push(_id);
                    entreprise
                      .save()
                      .then(() =>
                        AdminModel.aggregate(pipeline).then(admins =>
                          resolve(admins[0])
                        )
                      );
                  }
                )
              )
          );
      });
    } else {
      new UserModel({ email, password, ref: "admins" })
        .save()
        .then(async ({ _id }) =>
          new AdminModel({
            uid: _id,
            first_name,
            last_name,
            num: await getNextSequenceValue("admins")
          })
            .save()
            .then(() =>
              EntrepriseModel.findById("5d67d58f4b55ce7cca662014").then(
                entreprise => {
                  entreprise.uid.push(_id);
                  entreprise
                    .save()
                    .then(() =>
                      AdminModel.aggregate(pipeline).then(admins =>
                        resolve(admins[0])
                      )
                    );
                }
              )
            )
        );
    }
  });
