const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|ico)?$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [    
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `${__dirname}/public`, to: "public" },
            ]
        }),
    ],
}