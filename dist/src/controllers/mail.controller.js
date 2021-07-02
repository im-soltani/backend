"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("../../common/mailer");
const sendMail = (req, res, next) => {
    const user = req.user;
    const { subject, body } = req.body;
    if (!subject || !body) {
        return res.sendStatus(422);
    }
    // to verify
    const data = {
        email: user.email,
        subject,
        body
    };
    mailer_1.default({
        template: "demande",
        footer: true,
        from: data.email,
        to: "contact@pharmaloop.fr",
        subject: data.subject,
        vars: {
            email: data.email,
            subject: data.subject,
            message: data.body
        }
    }, function (err, info) {
        res.send({ err, info });
    });
};
exports.MailController = {
    sendMail
};
//# sourceMappingURL=mail.controller.js.map