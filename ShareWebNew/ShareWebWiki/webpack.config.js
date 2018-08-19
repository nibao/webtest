const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = ({ production } = {}) => ({
    context: __dirname,
    entry: [
        './src/root.css',
        './src/bootstrap.tsx'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
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
        loaders: require('../webpack.rules')
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true,
        })
    ],
    devtool: 'source-map',
    devServer: {
        port: 9100,
        publicPath: '/dist/',
        contentBase: [
            __dirname,
            path.resolve(__dirname, 'apis')
        ],
        compress: true,
    }
})