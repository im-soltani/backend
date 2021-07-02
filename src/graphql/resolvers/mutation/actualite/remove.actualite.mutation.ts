import { ActualiteModel } from "../../../../models";
const fetch = require("node-fetch");

export default async (
  _,
  { id },
  {
    user: {
      profile: { _id },
    },
  }
) =>
  new Promise(async (resolve, reject) => {
    ActualiteModel.findOne({ _id: id }).then(async (returnedObj) => {
      returnedObj.unIndex();
      await returnedObj.remove();

      await fetch(
        `https://elastic.toolynk-lab.com/boostmyjob/actualité/${id}`,
        { method: "DELETE", body: "" }
      );
      /*       ActualiteModel.createMapping(function (err, mapping) {
        if (err) {
          console.log(
            "error creating mapping (you can safely ignore this)"
          );
          console.log(err);
        } else {
          console.log("mapping created!");

          var stream = ActualiteModel.synchronize();
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
      }); */
      resolve(returnedObj);
    });
  });
