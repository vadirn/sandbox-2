const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('chalk');
const { watch, resolve } = require('./env');
const { watchRoutes } = require('./watch-routes');
const webpackConfig = require('../../webpack.config');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.green;

console.log(info(`Clearing ${chalk.bold(resolve('__tw__'))}`));
fs.emptyDirSync(resolve('__tw__'));

watchRoutes(
  watch,
  resolve('src', 'node_modules', '@tw'),
  resolve('src', 'routes')
);

const compiler = webpack(webpackConfig);

const webpackCallback = (err, stats) => {
  if (err) {
    console.log(error(err.stack || err));
    if (err.details) {
      console.log(error(err.details));
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(error(info.errors));
  }

  if (stats.hasWarnings()) {
    console.log(warning(info.warnings));
  }

  if (!stats.hasErrors()) {
    console.log(`> compiled in ${chalk.bold(info.time)} ms`);
  }
};

if (watch) {
  compiler.watch({ aggregateTimeout: 300 }, webpackCallback);
} else {
  compiler.run(webpackCallback);
}
