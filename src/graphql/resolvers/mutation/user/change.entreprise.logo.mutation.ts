import { createWriteStream } from "fs";
import { Types } from "mongoose";
import { EntrepriseModel } from "../../../../models";

export default (_, { file, id }, { user: { _id, role } }) => {
  let filter = {};
  if (role === "ADMIN") filter = { _id: Types.ObjectId(id) };
  else filter = { uid: Types.ObjectId(_id) };
  return EntrepriseModel.findOne(filter).then(user => {
    if (!user) {
      return false;
    }
    return new Promise(async (resolve, reject) => {
      const filename = `${Date.now()}.jpg`;
      const path = `uploads/logos/${filename}`;
      const { stream } = await file;
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => {
          (user as any).profile_pic_url = `/media/logos/${filename}`;
          return user.save().then(() => {
            EntrepriseModel.createMapping(function (err, mapping) {
              if (err) {
                console.log(
                  "error creating mapping (you can safely ignore this)"
                );
                console.log(err);
              } else {
                console.log("mapping created!");

                var stream = EntrepriseModel.synchronize();
                var count = 0;

                stream.on("data", function (err, doc) {
                  count++;
                });
                stream.on("close", function () {
                  console.log(
                    "[ElasticSearch] Indexed " + count + " " + " documents!"
                  );
                });
                stream.on("error", function (err) {
                  console.log("mongoosastic ERROR");
                  console.log(err);
                });
              }
            });
            resolve(true)
          });
        })
        .on("error", err => reject(err));
    });
  });
};
