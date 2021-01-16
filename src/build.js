'use strict';

const app = require('commander');

const chalk = require('chalk');
const log = console.log;

const helpers = require('./helpers');
helpers.setProduction(true);

const webpack = require('webpack');


app
  .version('1.0.0')
  .parse(process.argv);

function buildHandle(err, stats) {
  if(err) {
    throw err;
  }

  const jsonStats = stats.toJson();

  if(stats.hasErrors()) {
    throw new Error(jsonStats.errors);
  }

  if(stats.hasWarnings()) {
    log(chalk.yellow(jsonStats.warnings))
  }

  log(stats.toString({ chunks: false, colors: true, children: false }))
  return true;
}


webpack(require('./config/webpack.config.js'), buildHandle);