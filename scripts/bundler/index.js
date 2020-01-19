const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const { watch, resolve } = require('./env');
const { watchRoutes } = require('./watch-routes');
const webpackConfig = require('../../webpack.config');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.green;

console.log(info(`Clearing ${chalk.bold('__tw__')}`));
fs.emptyDirSync(resolve('__tw__'));

console.log(info(`Watching routes directory ${chalk.bold('src/routes')}`));
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
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);
  server.listen(8080, 'localhost', err => {
    if (err) {
      console.log(error(err.stack || err));
      if (err.details) {
        console.log(error(err.details));
      }
    }
    console.log('WebpackDevServer listening at localhost:', 8080);
  });
} else {
  compiler.run(webpackCallback);
}
