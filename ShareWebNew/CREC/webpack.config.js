const path = require('path');
const webpack = require('webpack');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rules = require('../webpack.rules');

let config = {
    debugHost: 'http://127.0.0.1',
    port: 4006
}

try {
    Object.assign(config, require('./config.json'))
} catch (e) { }

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: {
        main: './src/index'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name].chunk.js',
        publicPath: '.'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        alias: {
            'react': production ? 'react/dist/react.min.js' : 'react/dist/react.js',
            'react-dom': production ? 'react-dom/dist/react-dom.min.js' : 'react-dom/dist/react-dom.js',
            'pdfjs-dist': 'pdfjs-dist/build/pdf.combined.js'
        }
    },
    module: {
        rules
    },
    target: 'web',
    devtool: 'source-map',
    stats: { colors: true },
    devServer: {
        hot: false,
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        publicPath: '/',
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/index.html' },
            ]
        },
        disableHostCheck: true,
        host: '0.0.0.0',
        port: config.port,
        proxy: {
            '/api': config.debugHost
        }
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/public/index.html',
            chunksSortMode(chunk1, chunk2) {
                const orders = ['config', 'main']
                const order1 = orders.indexOf(chunk1.names[0])
                const order2 = orders.indexOf(chunk2.names[0])
                if (order1 > order2) {
                    return 1
                } else if (order1 < order2) {
                    return -1
                } else {
                    return 0
                }
            },
            minify: false
        }),
        new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
        }),
        new CopyWebpackPlugin([
            {
                from: './libs/webuploader/dist/Uploader.swf',
                to: 'libs/Uploader.swf'
            },
            {
                from: './libs/es5-sham.custom.min.js',
                to: 'libs/es5-sham.custom.min.js'
            },
            {
                from: './libs/es5-shim.min.js',
                to: 'libs/es5-shim.min.js'
            },
            {
                from: './libs/es6-sham.min.js',
                to: 'libs/es6-sham.min.js'
            },
            {
                from: './libs/es6-shim.min.js',
                to: 'libs/es6-shim.min.js'
            },
            {
                from: './libs/es6-promise.auto.min.js',
                to: 'libs/es6-promise.auto.min.js'
            },
            {
                from: './src/config.js',
                to: 'scripts/config.js'
            },
            {
                from: './README.md',
                to: 'README.md'
            },
            {
                from: './editmessage.aspx',
                to: 'editmessage.aspx'
            }
        ]),
        ...(production ? [
            new webpack.optimize.UglifyJsPlugin({
                mangle: true,
                comments: false,
                compress: { screw_ie8: false },
                mangle: { screw_ie8: false },
                output: { screw_ie8: false },
                sourceMap: false
            }),
        ] : [])
    ],
})