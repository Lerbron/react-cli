const webpack = require('webpack')
const {
  merge
} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const helpers = require('../helpers')
const commonConfig = require('./webpack.common')
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const glob = require("glob-all");
const CompressionPlugin = require('compression-webpack-plugin');


const baseConfig = {
  entry: helpers.feConfig.entry,
  plugins: [
    new HtmlWebpackPlugin({
      template: helpers.root('../index.html'),
      filename: helpers.dest('index.html'),
      base: helpers.feConfig.baseUrl,
      buildTime: new Date().toLocaleString(),
      title: helpers.feConfig.title,
      cache: false,
      inject: true,
    }),

    new CaseSensitivePathsPlugin()
  ]
}

if (!helpers.production()) {
  baseConfig.devtool= 'source-map'
} else {
  baseConfig.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      }),
      new OptimizeCssAssetsPlugin()
    ]
  }
  baseConfig.plugins= [
    ...baseConfig.plugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
      algorithm: 'gzip',
      compressionOptions: { level: 5 },
    }),
    // new PurgeCSSPlugin({
    //   paths: glob.sync([
    //     `${helpers.root('*./*.{tsx,scss,less,css}')}`,
    //     `${helpers.root("../*.html")}`,
    //   ], {
    //     nodir: true
    //   }),
    // }),
    // new webpack.BannerPlugin({
    //   raw: true,
    //   banner: '/** @preserve Powered by chenwl */',
    // }),
  ]
}


module.exports = merge(commonConfig, baseConfig)