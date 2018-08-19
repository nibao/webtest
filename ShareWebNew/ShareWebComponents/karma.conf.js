// Karma configuration
// Generated on Mon Dec 18 2017 11:20:53 GMT+0800 (中国标准时间)

const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'libs/es6-shim.min.js',
      'libs/es6-sham.min.js',
      'libs/es6-promise.auto.min.js',

      'test.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test.js': ['webpack', 'sourcemap']
    },

    // mocha配置
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',

        // custom ui, defined in required file above
        ui: 'bdd',
      }
    },

    // karma watches the test entry points
    // (you don't need to specify the entry option)
    // webpack watches dependencies

    // webpack configuration
    webpack: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
      },
      module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
          {
            test: /\.tsx?$/,
            exclude: /(node_modules|libs|ShareWebUtil|ShareWebCore|ShareWebUI|\.test\.tsx$)/,
            loader: 'istanbul-instrumenter-loader',
            enforce: 'post',
            options: {
              esModules: true,
              produceSourceMap: true
            }
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              use: [{
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
            loader: 'file-loader',
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
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: '[name].css',
          allChunks: true
        })
      ],
      devtool: 'inline-source-map',
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul', 'junit'],

    mochaReporter: {
      showDiff: true
    },

    coverageIstanbulReporter: {
      dir: 'testResult/coverage',
      reports: ['text-summary', 'html'],
      fixWebpackSourcePaths: true
    },

    junitReporter: {
      outputDir: 'testResult/junit',
      outputFile: 'test-results.xml'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
      'Firefox',
      'IE'
    ],

    // karma-server support ts/tsx mime 
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}