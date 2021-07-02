import * as jwt from "jsonwebtoken";

const generate = (payload) =>
  new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, "boostmyjob-toolynk-key", {
        expiresIn: "10d",
      });
      resolve(token);
    } catch (e) {
      reject(e);
    }
  });

const ensure = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, "boostmyjob-toolynk-key", function (err, payload) {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });

export default {
  generate,
  ensure,
};
