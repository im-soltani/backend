import { ApolloServer } from "apollo-server-express";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as expressValidator from "express-validator";
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import * as logger from "morgan";
import * as passport from "passport";
import * as passportJwt from "passport-jwt";

import schema from "./graphql";

import { SessionModel, UserModel } from "./models";
import { AuthRouter, MailRouter, MediaRouter } from "./routers";

class Server {
  public app: express.Application;

  constructor() {
    dotenv.config();

    this.app = express();
    this.connectMongoDB();
    this.config();
    this.setupRoutes();
  }

  private connectMongoDB() {
    const opts = {
      useNewUrlParser: true,
      useCreateIndex: true,
    };
    mongoose
      .connect("mongodb://localhost:27017/boostmyjob", opts)
      .then(() => console.log("Connected to database"))
      .catch(() => console.log("Failed connect to database"));
  }

  private config() {
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

  private setupRoutes() {
    this.app.use("/auth", AuthRouter);
    this.app.use("/media", MediaRouter);
    this.app.use(
      "/mailer",
      this.checkH2HSession,
      passport.authenticate("jwt", { session: false }),
      MailRouter
    );
    this.app.use(
      "/graphql",
      this.checkH2HSession,
      passport.authenticate("jwt", { session: false })
    );
    this.setupGraphQL();
  }

  private checkH2HSession(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.sendStatus(401);
    }
    SessionModel.findOne({ token })
      .then((session) => (session ? next() : res.sendStatus(401)))
      .catch((err) => next(err));
  }

  private setupPassport() {
    const JwtStrategy = passportJwt.Strategy;
    const ExtractJwt = passportJwt.ExtractJwt;
    const opts = {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: "boostmyjob-toolynk-key",
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
          case "ECOLE":
            ref = "entreprises";
            break;
        }
        UserModel.aggregate([
          { $match: { _id: Types.ObjectId(payload.id) } },
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
            const user = { ...users[0], role: payload.role };
            done(null, user);
          })
          .catch((err) => done(err, false));
      })
    );
  }

  private setupGraphQL() {
    const server = new ApolloServer({
      schema,
      context: ({ req }) => ({
        user: (req as any).user,
        token: req.headers.authorization,
      }),
    });
    server.applyMiddleware({
      app: this.app,
      path: "/graphql",
    });
  }
}

export default new Server().app;
