import { Router } from "express";
import { MailController } from "../controllers";

export const MailRouter = Router().post("/", MailController.sendMail);
