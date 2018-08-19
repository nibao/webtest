const path = require('path');
const webpack = require('webpack');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const timeout = require('connect-timeout');
const rules = require('../webpack.rules');

const config = {
    debugHost: 'http://192.168.138.134:8080',
    port: 9001
}

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: {
        vendor: [
            './libs/es5-shit.js',
            'react',
            'react-dom',
            'lodash',
            'react-router',
            'webuploader',
            'tslib',
            'classnames'
        ],
        main: [
            './libs/root.css',
            './libs/reset.css',
            './src/index.tsx',
            './src/root.css'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name].chunk.js?v=[hash]',
        publicPath: '/'
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
        rules: rules
    },
    target: 'web',
    devtool: production ? '' : 'source-map',
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
            '/api': config.debugHost,
            '/interface': config.debugHost,
            '/meta': config.debugHost
        },
        setup(app) {
            app.use(timeout(1000 * 60 * 60))
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "scripts/vendor.js" }),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/public/index.html',
            chunksSortMode: 'dependency',
            inject: false,
            minify: false
        }),
        new CopyWebpackPlugin([{
            from: './libs',
            to: 'libs'
        }]),
        new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
        }),
        ...(production ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: { screw_ie8: false },
                mangle: { screw_ie8: false },
                output: { screw_ie8: false },
                parallel: true,
                cache: true,
                sourceMap: false,
            }),
        ] : [])
    ],
})