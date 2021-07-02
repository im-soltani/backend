"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.MailRouter = express_1.Router()
    .post("/", controllers_1.MailController.sendMail);
//# sourceMappingURL=mail.router.js.map