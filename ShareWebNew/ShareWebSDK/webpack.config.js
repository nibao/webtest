const path = require('path');
const webpack = require('webpack');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: {
        'anyshare.desktop': [
            './libs/es5-shit.js',
            './src/anyshare.desktop.tsx'
        ],
        'anyshare.mobile': [
            './libs/es5-shit.js',
            './src/anyshare.mobile.tsx'
        ],
        'anyshare.desktop.public': [
            './libs/es5-shit.js',
            './src/anyshare.desktop.public.tsx'
        ],
        'anyshare.mobile.public': [
            './libs/es5-shit.js',
            './src/anyshare.mobile.public.tsx'
        ],
        'anyshare.console': [
            './libs/es5-shit.js',
            './src/anyshare.console.tsx'
        ],
        'anyshare.openapi': [
            './libs/es5-shit.js',
            './src/anyshare.openapi.ts'
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'AnyShare'
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
    cache: !production,
    watch: !production,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { screw_ie8: false },
            mangle: { screw_ie8: false },
            output: { screw_ie8: false },
            parallel: true,
            cache: true,
            sourceMap: false,
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ],
    devtool: 'source-map',
})