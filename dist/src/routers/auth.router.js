"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const contants_1 = require("../tools/contants");
exports.AuthRouter = express_1.Router()
    .post("/register/admin", (req, res, next) => controllers_1.AuthController.register(req, res, next, contants_1.UserRole.ADMIN))
    .post("/register/candidat", (req, res, next) => controllers_1.AuthController.register(req, res, next, contants_1.UserRole.CANDIDAT))
    .post("/register/entreprise", (req, res, next) => controllers_1.AuthController.register(req, res, next, contants_1.UserRole.ENTREPRISE))
    .post("/login/admin", (req, res, next) => controllers_1.AuthController.login(req, res, next, contants_1.UserRole.ADMIN))
    .post("/login/candidat", (req, res, next) => controllers_1.AuthController.login(req, res, next, contants_1.UserRole.CANDIDAT))
    .post("/login/entreprise", (req, res, next) => controllers_1.AuthController.login(req, res, next, contants_1.UserRole.ENTREPRISE))
    .post("/password/reset/code/candidat/send", controllers_1.AuthController.sendResetCode("candidats"))
    .post("/password/reset/code/entreprise/send", controllers_1.AuthController.sendResetCode("entreprises"))
    .post("/password/reset/code/check", controllers_1.AuthController.checkResetCode)
    .post("/password/reset/candidat", controllers_1.AuthController.resetPassword("candidats"))
    .post("/password/reset/entreprise", controllers_1.AuthController.resetPassword("entreprises"))
    .post("/logout", controllers_1.AuthController.logout)
    .post("/token/check", controllers_1.AuthController.checkToken);
//# sourceMappingURL=auth.router.js.map