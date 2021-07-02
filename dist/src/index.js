"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const http_1 = require("http");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const mongoose_1 = require("mongoose");
const graphql_2 = require("./graphql");
const models_1 = require("./models");
const Server_1 = require("./Server");
const token_1 = require("./tools/token");
const ws = http_1.createServer(Server_1.default);
ws.listen(process.env.PORT)
    .on("listening", () => {
    console.log(`Server started at port ${process.env.PORT}`);
    new subscriptions_transport_ws_1.SubscriptionServer({
        execute: graphql_1.execute, subscribe: graphql_1.subscribe, schema: graphql_2.default, onConnect: (connectionParams) => {
            if (connectionParams.token) {
                const token = connectionParams.token;
                return token_1.default.ensure(token)
                    .then(payload => {
                    let ref = null;
                    switch (payload.role) {
                        case "ADMIN":
                            ref = "admins";
                            break;
                        case "CLIENT":
                            ref = "candidats";
                            break;
                        case "PHARMACY":
                            ref = "entreprises";
                            break;
                        case "DELIVERY_MAN":
                            ref = "delivery_mens";
                    }
                    const pipeline = [
                        { $match: { _id: mongoose_1.Types.ObjectId(payload.id) } },
                        {
                            $lookup: {
                                from: ref,
                                as: "profile",
                                localField: "_id",
                                foreignField: "uid"
                            }
                        },
                        { $unwind: "$profile" }
                    ];
                    return models_1.UserModel.aggregate(pipeline)
                        .then(users => {
                        if (!users.length) {
                            throw new Error("UnAuthorized");
                        }
                        else {
                            const user = Object.assign({}, users[0], { role: payload.role });
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
        }
    }, {
        server: ws,
        path: "/subscriptions"
    });
})
    .on("error", (error) => console.log(error));
//# sourceMappingURL=index.js.map