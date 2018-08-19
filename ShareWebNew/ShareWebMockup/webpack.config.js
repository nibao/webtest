const process = require('process');
const path = require('path');
const glob = require('glob');

module.exports = ({production} = {}) => ({
    context: __dirname,
    entry: 'src/server.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'source-map',
    module: {
        rules: require('../webpack.rules')
    }
})