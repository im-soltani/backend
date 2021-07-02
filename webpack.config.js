const path = require("path");
const nodeModules = require("webpack-node-externals");

const SRC_DIR = path.resolve("src");
const BUILD_DIR = path.resolve("build");

module.exports = {
    mode: "development",
    watch: true,
    target: "node",
    devtool: "eval",
    entry: SRC_DIR + "/index.ts",
    output: {
        path: BUILD_DIR,
        filename: "server.js"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    externals: nodeModules(),
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: "pre",
                exclude: /node_modules/,
                use: "tslint-loader"
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    }
};