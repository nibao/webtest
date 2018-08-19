const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rules = require('../webpack.rules')

let config = {
    debugHost: 'http://127.0.0.1',
    port: 4008
}

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: {
        vendor: [
            'react',
            'react-dom',
            'lodash',
            'react-router',
            'webuploader',
            'tslib',
            'classnames'
        ],
        main: production ? './src/index.prod' : [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://127.0.0.1:${config.port}/`,
            'webpack/hot/only-dev-server',
            './src/index.dev'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name].chunk.js',
        publicPath: './'
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
        rules: production ? rules : [{
            test: /\.tsx?$/,
            use: [{
                loader: 'react-hot-loader/webpack'
            }, {
                loader: 'ts-loader',
                query: {
                    transpileOnly: true
                }
            }]
        }, ...rules.slice(1)]
    },
    target: 'web',
    devtool: production ? '' : 'source-map',
    stats: { colors: true },
    devServer: {
        hot: true,
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
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "scripts/vendor.js" }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'AnyShare',
            template: './public/index.html',
            chunksSortMode: 'dependency',
            inject: false,
            minify: false
        }),
        new CopyWebpackPlugin([{
            from: './public'
        }, {
            from: './libs',
            to: 'libs'
        }]),
        new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
        }),
        ...(production ? [
            new UglifyJsPlugin({
                uglifyOptions: {
                    comments: false,
                    compress: true,
                    mangle: true,
                },
                parallel: true,
                cache: true,
                exclude: /node_modules/,
                sourceMap: false,
            }),
        ] : [])
    ],
})