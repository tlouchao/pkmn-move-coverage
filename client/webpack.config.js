require("dotenv").config()

const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const path = require("path")

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: path.join(__dirname, "src", "index.js"),
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.client.js",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        historyApiFallback: true,
        port: process.env.PORT || 3000,
    },
    devtool: process.env.NODE_ENV == "development" ? "source-map" : false,
    resolve: {
        extensions: [".js",".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader:"babel-loader",
            },
            {
                test: /\.(png|jpg)?$/,
                exclude: /node_modules/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [    
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            inject: "body"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `${__dirname}/public`, to: "public" },
            ]
        }),
    ],
}