import { Router } from "express";
import { AuthController } from "../controllers";

import { UserRole } from "../tools/contants";

export const AuthRouter = Router()
  .post("/register/admin", (req, res, next) =>
    AuthController.register(req, res, next, UserRole.ADMIN)
  )
  .get("/settings", (req, res, next) =>
    AuthController.getSettingsPublic(req, res, next)
  )
  .post("/register/candidat", (req, res, next) =>
    AuthController.register(req, res, next, UserRole.CANDIDAT)
  )

  .post("/registerfromoutside/candidat", (req, res, next) =>
    AuthController.registerfromoutside(req, res, next, UserRole.CANDIDAT)
  )

  .post("/register/entreprise", (req, res, next) =>
    AuthController.register(req, res, next, UserRole.ENTREPRISE)
  )
  .post("/register/ecole", (req, res, next) =>
    AuthController.register(req, res, next, UserRole.ECOLE)
  )

  .post("/login/admin", (req, res, next) =>
    AuthController.login(req, res, next, UserRole.ADMIN)
  )

  .post("/check/email", (req, res, next) =>
    AuthController.checkEmail(req, res, next)
  )

  .post("/login/candidat", (req, res, next) =>
    AuthController.login(req, res, next, UserRole.CANDIDAT)
  )

  .post("/linkedinlogin/candidat", (req, res, next) =>
    AuthController.loginWithLinkedIn(req, res, next, UserRole.CANDIDAT)
  )

  .post("/login/entreprise", (req, res, next) =>
    AuthController.login(req, res, next, UserRole.ENTREPRISE)
  )
  .post("/loginfromsite/entreprise", (req, res, next) =>
    AuthController.loginOutSide(req, res, next, UserRole.ENTREPRISE)
  )
  .post("/loginfromsite/candidat", (req, res, next) =>
    AuthController.loginOutSide(req, res, next, UserRole.CANDIDAT)
  )
  .post("/password/reset/code/check", AuthController.checkResetCode)

  .post(
    "/password/reset/code/candidat/send",
    AuthController.sendResetCode("candidats")
  )
  .post("/password/reset/candidat", AuthController.resetPassword("candidats"))

  .post(
    "/password/reset/code/entreprise/send",
    AuthController.sendResetCode("entreprises")
  )
  .post(
    "/password/reset/entreprise",
    AuthController.resetPassword("entreprises")
  )

  .post(
    "/password/reset/code/admin/send",
    AuthController.sendResetCode("admins")
  )
  .post("/password/reset/admin", AuthController.resetPassword("admins"))

  .post("/logout", AuthController.logout)
  .post("/token/check", AuthController.checkToken)

  .post("/update/society", AuthController.updateSociety)
  .post("/update/password", AuthController.updatePassword)
  .post("/update/password/forced", AuthController.updatePasswordForced);
