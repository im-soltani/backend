"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const generate = (payload) => new Promise((resolve, reject) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        resolve(token);
    }
    catch (e) {
        reject(e);
    }
});
const ensure = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, payload) {
        if (err) {
            return reject(err);
        }
        resolve(payload);
    });
});
exports.default = {
    generate,
    ensure
};
//# sourceMappingURL=token.js.map