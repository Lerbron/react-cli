const chalk = require('chalk');
const log = console.log;
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const os = require('os');
var threadPool = os.cpus().length - 1;

const {
  getCssLoaders
} = require("./utils");

const helpers = require('../helpers')
log(chalk.green('react-cli root:', helpers.feRoot()))
log(chalk.green('project root:', helpers.root()))
log(chalk.green('project root:', helpers.dest()))

const vendor= helpers.feConfig.vendor.join('|')
const vendorReg= new RegExp(`/node_modules/(${vendor})`)

var config = {
  context: helpers.root(),
  mode: helpers.getModel(),
  target: 'web',

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        },
        vendor: {
          test: vendorReg,
          name: 'vendor',
          chunks: 'all',
        }
      }
    },
  },

  resolve: {
    modules: [
      helpers.root(),
      helpers.root('../node_modules'),
      helpers.feRoot('node_modules'),
      helpers.feRoot('node_modules/antd/node_modules')
    ],
    alias: {
      "@": helpers.root()

    },
    extensions: ['.web.js', '.js', '.json', '.ts', '.tsx']
  },

  resolveLoader: {
    modules: [helpers.root('../node_modules'), helpers.feRoot('node_modules')]
  },

  output: {
    publicPath: helpers.production() ? (helpers.feConfig.cdn || helpers.feConfig.baseUrl) : helpers.feConfig.baseUrl,
    path: helpers.dest(),
    filename: !helpers.production() ? 'js/[name].js' : 'js/[name].[chunkhash:6].js'
  },

  module: {
    rules: [{
        test: /\.(tsx?|js)$/,
        include: [
          helpers.root(''),
        ],
        use: [{
            loader: 'thread-loader',
            options: {
              workers: threadPool
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                require.resolve('@babel/preset-env'), 
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: [
                require.resolve('@babel/plugin-transform-async-to-generator'),
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-export-default-from'),
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('@babel/plugin-transform-modules-commonjs'),
                require.resolve('babel-plugin-dynamic-import-webpack'),
                [ require.resolve('babel-plugin-import'),
                  {
                    style: 'css',
                    libraryName: 'antd',
                    libraryDirectory: 'es'
                  }
                ]
              ]
            }
          }
        ],

      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !helpers.production()
            },
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('../index.html')]
      },

      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      
      {
        test: /\.(jpe?g|png|gif|ico|xlsx)/,
        loader: 'file-loader',
        options: {
          context: helpers.root(),
          name: '[path][name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),
    
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer
        ]
      }
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
	stats: "errors-only",
}
if (helpers.production()) {
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  );
}

module.exports = config