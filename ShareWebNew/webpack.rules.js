const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
            transpileOnly: true
        }
    },
    {
        test: /\.jsx?$/,
        loader: 'babel-loader',
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[path][name]---[local]'
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.resolve(__dirname, 'postcss.config.js')
                        }
                    }
                }
            ]
        })
    },
    {
        test: /\.png$|\.gif$/,
        loader: 'url-loader'
    },
    {
        test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'base64-font-loader',
        options: {
            name: 'assets/fonts/[name].[ext]'
        }
    },
    {
        test: /\.swf$/,
        loader: 'file-loader',
        options: {
            name: 'assets/[name].[ext]'
        }
    },
    {
        test: /\.md$/,
        loader: 'html-loader!markdown-loader'
    },
]