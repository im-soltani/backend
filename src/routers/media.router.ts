import { Router } from "express";
import { MediaController } from "../controllers";

export const MediaRouter = Router()
  .all("/prescription/:name", MediaController.pipePrescription)
  .all("/cvs/:name", MediaController.pipeCV)
  .all("/avatars/:name", MediaController.pipeAvatar)
  .all("/logos/:name", MediaController.pipeLogos)
  .all("/banners/:name", MediaController.pipeBanners)
  .all("/extras/:name", MediaController.pipeExtra)
  .all("/xmls/:name", MediaController.pipeXML);
