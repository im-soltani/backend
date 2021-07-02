import {makeExecutableSchema} from "graphql-tools";

import directiveResolvers from "./directiveResolvers";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

export default makeExecutableSchema({
    typeDefs,
    resolvers,
    directiveResolvers,
    logger: {
        log: message => {
            // console.log("Logger: ", message);
        }
    }
});
