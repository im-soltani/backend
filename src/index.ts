import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { Types } from "mongoose";
import schema from "./graphql";
import { UserModel } from "./models";
import Server from "./Server";
import Token from "./tools/token";

const ws = createServer(Server);

ws.listen(6520)
  .on("listening", () => {
    console.log("Server started at port");
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams) => {
          if (connectionParams.token) {
            const token = connectionParams.token;
            return Token.ensure(token)
              .then((payload) => {
                let ref = null;
                switch ((payload as any).role) {
                  case "ADMIN":
                    ref = "admins";
                    break;
                  case "CLIENT":
                    ref = "candidats";
                    break;
                  case "ENTREPRISE":
                    ref = "entreprises";
                    break;
                  case "DELIVERY_MAN":
                    ref = "delivery_mens";
                }
                const pipeline = [
                  { $match: { _id: Types.ObjectId((payload as any).id) } },
                  {
                    $lookup: {
                      from: ref,
                      as: "profile",
                      localField: "_id",
                      foreignField: "uid",
                    },
                  },
                  { $unwind: "$profile" },
                ];
                return UserModel.aggregate(pipeline)
                  .then((users) => {
                    if (!users.length) {
                      throw new Error("UnAuthorized");
                    } else {
                      const user = { ...users[0], role: (payload as any).role };
                      return { user };
                    }
                  })
                  .catch((err) => {
                    throw new Error("UnAuthorized");
                  });
              })
              .catch((err) => {
                throw new Error("UnAuthorized");
              });
          }
        },
      },
      {
        server: ws,
        path: "/subscriptions",
      }
    );
  })
  .on("error", (error: NodeJS.ErrnoException) => console.log(error));
