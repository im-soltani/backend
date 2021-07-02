import {GraphQLUpload} from "apollo-server-express";

import Mutation from "./mutation";
import Query from "./queries";
import Subscription from "./subscription";
import NestedResolvers from "../nestedResolvers";

export default {
    Query,
    Mutation,
    Subscription,
    Upload: GraphQLUpload,
    ...NestedResolvers
};
