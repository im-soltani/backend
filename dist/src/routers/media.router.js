"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.MediaRouter = express_1.Router()
    .all("/prescription/:name", controllers_1.MediaController.pipePrescription)
    .all("/card/mutual/:name", controllers_1.MediaController.pipeCV)
    .all("/card/vital/:name", controllers_1.MediaController.pipeVitalCard)
    .all("/avatars/:name", controllers_1.MediaController.pipeAvatar);
//# sourceMappingURL=media.router.js.map