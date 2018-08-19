const process = require('process');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: {
        vendor: [
            'core-js',
            'tslib',
            'react',
            'react-dom',
            'lodash',
            'classnames'
        ],
        main: [
            './src/reset.css',
            './src/bootstrap.tsx',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name].chunk.js',
        libraryTarget: 'commonjs2',
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
        rules: require('../webpack.rules')
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
        }),
        new CopyWebpackPlugin([
            {
                from: './libs',
                to: 'libs'
            }
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/public/index.html',
            inject: false,
            minify: false,
        }),
        new HtmlWebpackPlugin({
            filename: 'assets/html/dialog.html',
            template: './src/assets/html/dialog.html',
            inject: false,
            minify: false,
        }),
        ...(production ?
            [
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
            ] :
            []
        ),
    ],
    devtool: production ? '' : 'source-map',
})