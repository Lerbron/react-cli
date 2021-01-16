'use strict';

const app = global.app = require('commander');

app
  .version('1.0.0')
  .option('-p, --port <port>', '启动端口', parseInt)
  .parse(process.argv);

const chalk = require('chalk');
const log = console.log;


const helpers = require('./helpers');
helpers.setProduction(false);

const webpack = require('webpack');
const webpackServer = require('webpack-dev-server');

let port = app.port || 3000;

function buildEntry() {

  new webpackServer(webpack(require('./config/webpack.config')), {
    host: '0.0.0.0',
    overlay: {//当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    inline: true,
    hot: false,
    // hotOnly: true,
    noInfo: true,
    disableHostCheck:true,
    historyApiFallback: { index: helpers.feConfig.baseUrl },
    stats: { colors: true, },
    contentBase: helpers.dest(),
    watchContentBase: true,
    publicPath: helpers.feConfig.baseUrl,
    proxy: helpers.feConfig.proxy,
    before: function(app) {
      // app.use(require('umi-mock').createMiddleware({
      //   cwd: helpers.root(),
      //   config: {},
      //   absPagesPath:helpers.root(),
      //   absSrcPath: helpers.root(),
      //   watch: false,
      //   errors: [],
      //   onStart({ paths }) {
      //   },
      // }));
    }
  }).listen(port, '0.0.0.0',function() {
    log(chalk.green('server started: http://localhost:' + port + helpers.feConfig.baseUrl));

  });
}


buildEntry()