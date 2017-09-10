import path from "path";
import webpack from "webpack";
import baseConf from "./base.conf.babel";

const plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("development")
        }
    }),
    new webpack.HotModuleReplacementPlugin()
];

const loaders = [
    {
        test: /\.css$/,
        include: [/global/, /node_modules/],
        loader: "style-loader!css-loader?sourceMap!postcss-loader"
    },
    {
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        loader:
            "style-loader!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader"
    },
    {
        test: /\.less$/,
        include: [/global/, /node_modules/],
        loader: "style-loader!css-loader?sourceMap!postcss-loader!less-loader"
    },
    {
        test: /\.less$/,
        exclude: [/global/, /node_modules/],
        loader:
            "style-loader!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!less-loader"
    }
];

const entry = {
    app: path.resolve(__dirname, "../src/app.ts")
};

let config = baseConf(plugins, loaders);
config.entry = entry;
config.devServer = {
    contentBase: "../dist",
    hot: true
};

export default config;
