"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const expressValidator = require("express-validator");
const helmet = require("helmet");
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const logger = require("morgan");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const graphql_1 = require("./graphql");
const models_1 = require("./models");
const routers_1 = require("./routers");
class Server {
  constructor() {
    dotenv.config();
    this.app = express();
    this.connectMongoDB();
    this.config();
    this.setupRoutes();
  }
  connectMongoDB() {
    const opts = {
      useNewUrlParser: true,
      useCreateIndex: true,
    };
    mongoose
      .connect("mongodb://localhost:27017/boostmyjob", opts)
      .then(() => console.log("Connected to database"))
      .catch(() => console.log("Failed connect to database"));
  }
  config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(logger("dev"));
    this.app.use(expressValidator());
    this.app.use(passport.initialize());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
    this.setupPassport();
  }
  setupRoutes() {
    this.app.use(process.env.AUTH_ENDPOINT, routers_1.AuthRouter);
    this.app.use(process.env.MEDIA_ENDPOINT, routers_1.MediaRouter);
    this.app.use(
      process.env.MAIL_ENDPOINT,
      this.checkH2HSession,
      passport.authenticate("jwt", { session: false }),
      routers_1.MailRouter
    );
    this.app.use(
      process.env.GRAPHQL_ENDPOINT,
      this.checkH2HSession,
      passport.authenticate("jwt", { session: false })
    );
    this.setupGraphQL();
  }
  checkH2HSession(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.sendStatus(401);
    }
    models_1.SessionModel.findOne({ token })
      .then((session) => (session ? next() : res.sendStatus(401)))
      .catch((err) => next(err));
  }
  setupPassport() {
    const JwtStrategy = passportJwt.Strategy;
    const ExtractJwt = passportJwt.ExtractJwt;
    const opts = {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET_KEY,
    };
    passport.use(
      new JwtStrategy(opts, function (payload, done) {
        let ref = null;
        switch (payload.role) {
          case "ADMIN":
            ref = "admins";
            break;
          case "CANDIDAT":
            ref = "candidats";
            break;
          case "ENTREPRISE":
            ref = "entreprises";
            break;
        }
        models_1.UserModel.aggregate([
          { $match: { _id: mongoose_1.Types.ObjectId(payload.id) } },
          {
            $lookup: {
              from: ref,
              as: "profile",
              localField: "_id",
              foreignField: "uid",
            },
          },
          { $unwind: "$profile" },
        ])
          .then((users) => {
            if (!users.length) {
              return done(null, false);
            }
            const user = Object.assign({}, users[0], { role: payload.role });
            done(null, user);
          })
          .catch((err) => done(err, false));
      })
    );
  }
  setupGraphQL() {
    const server = new apollo_server_express_1.ApolloServer({
      schema: graphql_1.default,
      context: ({ req }) => ({
        user: req.user,
        token: req.headers.authorization,
      }),
    });
    server.applyMiddleware({
      app: this.app,
      path: process.env.GRAPHQL_ENDPOINT,
    });
  }
}
exports.default = new Server().app;
//# sourceMappingURL=Server.js.map
