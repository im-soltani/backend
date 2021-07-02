import * as fs from "fs";

export default fs.readFileSync("./src/graphql/typeDefs/schema.graphqls", "utf-8");