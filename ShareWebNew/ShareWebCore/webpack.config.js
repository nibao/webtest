const path = require('path');
const glob = require('glob');

module.exports = {
    context: __dirname,
    entry: glob.sync(path.resolve(__dirname, 'src/**/*test*.ts')),
    output: {
        path: path.resolve(__dirname, 'test'),
        filename: 'test.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
        ]
    },
    devtool: 'source-map',
}