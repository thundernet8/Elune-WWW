import path from "path";
import webpack from "webpack";
const AssetsPlugin = require("assets-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
const getPlugins = function() {
    let plugins = [
        new webpack.DllPlugin({
            context: __dirname,
            path: "manifest.json",
            name: "[name]_[chunkhash:8]"
        }),
        new AssetsPlugin({
            filename: "venders-config.json",
            path: "./"
        })
    ];

    if (!isDev) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: true
            })
        );
    }
    return plugins;
};

export default {
    devtool: "#source-map", // '#eval-source-map'
    entry: {
        venders: [
            "react",
            "react-dom",
            "react-router",
            "babel-polyfill",
            "mobx",
            "mobx-react",
            "axios",
            "classnames",
            "react-headroom"
        ]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets/js"),
        publicPath: "/assets/js/",
        filename: "[name].[chunkhash:8].js",
        library: "[name]_[chunkhash:8]"
    },
    plugins: getPlugins()
};
