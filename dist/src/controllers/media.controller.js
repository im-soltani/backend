"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const pipePrescription = (req, res, next) => {
    const filename = req.params.name;
    const path = `./uploads//${filename}`;
    pipe(req, res, next, path);
};
const pipeCV = (req, res, next) => {
    const filename = req.params.name;
    const path = `./uploads/cards/mutual/${filename}`;
    pipe(req, res, next, path);
};
const pipeVitalCard = (req, res, next) => {
    const filename = req.params.name;
    const path = `./uploads/cards/vital/${filename}`;
    pipe(req, res, next, path);
};
const pipeAvatar = (req, res, next) => {
    const filename = req.params.name;
    const path = `./uploads/avatars/${filename}`;
    pipe(req, res, next, path);
};
const pipe = (req, res, next, path) => {
    if (fs_1.existsSync(path)) {
        try {
            const data = fs_1.readFileSync(path);
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
        }
        catch (e) {
            next(e);
        }
    }
    else {
        res.writeHead(404);
        res.end();
    }
};
exports.MediaController = {
    pipePrescription,
    pipeCV,
    pipeVitalCard,
    pipeAvatar,
};
//# sourceMappingURL=media.controller.js.map