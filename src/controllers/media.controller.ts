import { existsSync, readFileSync } from "fs";

const pipePrescription = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/prescriptions/${filename}`;
  pipe(
    req,
    res,
    next,
    path
  );
};

const pipeCV = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/cvs/${filename}`;
  pipe_cv(req, res, next, path);
};

const pipeExtra = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/extras/${filename}`;
  pipe_cv(req, res, next, path);
};
const pipeXML = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/xmls/${filename}`;
  pipe_cv(req, res, next, path);
};

const pipeAvatar = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/avatars/${filename}`;
  pipe(
    req,
    res,
    next,
    path
  );
};
const pipeLogos = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/logos/${filename}`;
  pipe(
    req,
    res,
    next,
    path
  );
};

const pipeBanners = (req, res, next) => {
  const filename = req.params.name;
  const path = `./uploads/banners/${filename}`;
  pipe(
    req,
    res,
    next,
    path
  );
};
const pipe = (req, res, next, path) => {
  if (existsSync(path)) {
    try {
      const data = readFileSync(path);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    } catch (e) {
      next(e);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
};

const pipe_cv = (req, res, next, path) => {
  if (existsSync(path)) {
    try {
      const data = readFileSync(path);
      res.writeHead(200, { "Content-Type": "x-pdf" });
      res.end(data);
    } catch (e) {
      next(e);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
};

export const MediaController = {
  pipePrescription,
  pipeCV,
  pipeAvatar,
  pipeLogos,
  pipeBanners,
  pipeExtra,
  pipeXML
};
