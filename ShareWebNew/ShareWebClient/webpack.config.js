const path = require('path');
const webpack = require('webpack');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let config = {
    debugHost: 'http://127.0.0.1',
    port: 4006
}

try {
    Object.assign(config, require('./config.json'))
} catch (e) { }


module.exports = ({ production } = {}) => {
    const rules = [
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
            loader: 'file-loader',
            options: {
                name: production ? '[hash].[ext]' : '[path][name].[ext]?[hash:8]',
                outputPath: 'assets/images/',
                publicPath: '/assets/images/',
            }
        },
        {
            test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
            loader: 'base64-font-loader',
            options: {
                name: 'assets/fonts/[name].[ext]?[hash:8]'
            }
        },
        {
            test: /\.swf$/,
            loader: 'file-loader',
            options: {
                name: 'assets/[name].[ext]?[hash:8]'
            }
        },
        {
            test: /\.md$/,
            loader: 'html-loader!markdown-loader'
        },
    ]

    return {
        context: __dirname,
        entry: {
            vendor: [
                './libs/es5-shit.js',
                'tslib',
                'react',
                'react-dom',
                'react-router',
                'classnames',
                'lodash',
                'webuploader',
            ],
            main: production ? './src/index.prod' : './src/index.dev'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'scripts/[name].js',
            chunkFilename: 'scripts/[name].chunk.js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
            alias: {
                'react': production ? 'react/dist/react.min.js' : 'react/dist/react.js',
                'react-dom': production ? 'react-dom/dist/react-dom.min.js' : 'react-dom/dist/react-dom.js',
                'pdfjs-dist': 'pdfjs-dist/build/pdf.combined.js',
                'webuploader': path.resolve(__dirname, 'libs/webuploader')
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
        stats: {
            colors: true
        },
        devServer: {
            hot: false,
            contentBase: path.resolve(__dirname, 'dist'),
            compress: true,
            publicPath: '/',
            historyApiFallback: {
                rewrites: [{
                    from: /./,
                    to: '/index.html'
                },]
            },
            disableHostCheck: true,
            host: '0.0.0.0',
            port: config.port,
            proxy: {
                '/api': config.debugHost
            }
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                filename: "scripts/vendor.js"
            }),
            new webpack.NamedModulesPlugin(),
            ...(production ? [new webpack.HotModuleReplacementPlugin()] : []),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(production ? 'production' : 'development')
                }
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/public/index.html',
                chunksSortMode: 'dependency',
                inject: false,
                minify: false
            }),
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
    }
}