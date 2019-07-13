import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import baseConf from './base.conf.babel';

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: true
    }),
    new ExtractTextPlugin({
        filename: 'css/app.[contenthash:8].css',
        disable: false,
        allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'), // eslint-disable-line global-require
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    })
];

const loaders = [
    {
        test: /\.css$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?sourceMap!postcss-loader'
        })
    },
    {
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use:
                'css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader'
        })
    },
    {
        test: /\.less$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?sourceMap!postcss-loader!less-loader'
        })
    },
    {
        test: /\.less$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use:
                'css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader!less-loader'
        })
    }
];

const entry = {
    app: ['babel-polyfill', path.resolve(__dirname, '../src/app.ts')]
};

const output = {
    path: path.resolve(__dirname, '../dist/assets'),
    publicPath:
        'https://static-0-1254131461.cos.ap-shanghai.myqcloud.com/elune/assets/',
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
};

let config = baseConf(plugins, loaders);
config.entry = entry;
config.output = output;

export default config;
