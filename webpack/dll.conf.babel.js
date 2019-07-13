import path from 'path';
import webpack from 'webpack';
const AssetsPlugin = require('assets-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const getPlugins = function() {
    let plugins = [
        new webpack.DllPlugin({
            context: __dirname,
            path: 'manifest.json',
            name: '[name]_[chunkhash:8]'
        }),
        new AssetsPlugin({
            filename: 'venders-config.json',
            path: './'
        }),
        new webpack.HashedModuleIdsPlugin()
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

const config = {
    entry: {
        venders: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'babel-polyfill',
            'mobx',
            'mobx-react',
            'axios',
            'classnames',
            'react-headroom',
            'react-document-meta',
            // "element-react",
            'element-react/next',
            'draft-js',
            'react-draft-wysiwyg',
            'moment'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist/assets/js'),
        publicPath: isDev
            ? '/assets/js/'
            : 'https://static-0-1254131461.cos.ap-shanghai.myqcloud.com/elune/assets/js/',
        filename: '[name].[chunkhash:8].js',
        library: '[name]_[chunkhash:8]'
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, '../src/shared')]
    },
    plugins: getPlugins()
};

if (isDev) {
    config.devtool = '#source-map'; // '#eval-source-map'
}

export default config;
