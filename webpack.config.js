const webpack = require('webpack');
const { resolve, mode } = require('./scripts/bundler/env');

let filename = '[name]';
if (mode === 'production') {
  filename = '[name].[chunkhash]';
}

const alias = {
  svelte: resolve('node_modules', 'svelte'),
  session: resolve('src', 'session'),
  ui: resolve('src', 'ui'),
  assets: resolve('src', 'assets'),
  routes: resolve('src', 'routes'),
};
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

module.exports = {
  mode,
  entry: {
    main: resolve('src', 'main.js'),
  },
  output: {
    path: resolve('__tw__', 'assets'),
    filename: `${filename}.js`,
    publicPath: '/assets/',
  },
  resolve: {
    alias,
    extensions,
    mainFields,
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ].filter(Boolean),
};

// const webpack = require('webpack');
// const path = require('path');
// const configuration = require('./src/configuration');

// configuration.logFlags('Logging flags from: webpack.config.js');

// const alias = {
//   svelte: path.resolve('node_modules', 'svelte'),
//   session: path.resolve('src', 'session'),
//   ui: path.resolve('src', 'ui'),
//   assets: path.resolve('src', 'assets'),
//   routes: path.resolve('src', 'routes'),
// };
// const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
// const mainFields = ['svelte', 'module', 'browser', 'main'];

// const autoReload =
//   !configuration.app.optimizeAssets && !process.env.DISABLE_AUTO_RELOAD;
// const mode = autoReload ? 'development' : 'production';

// module.exports = {
//   client: {
//     entry: {},
//     output: {},
//     resolve: { alias, extensions },
//     module: {
//       rules: [
//         {
//           test: /\.(svelte|html)$/,
//           use: {
//             loader: 'svelte-loader',
//             options: {
//               dev: mode === 'development',
//               hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
//             },
//           },
//         },
//         // {
//         //   test: /\.(js)$/,
//         //   exclude: /(src?!\/)node_modules(?!\/svelte)/,
//         //   include: [
//         //     path.resolve('src') + '/**',
//         //     path.resolve('node_modules') + '/svelte/**',
//         //   ],
//         //   loader: 'babel-loader',
//         // },
//       ],
//     },
//     mode,
//     plugins: [
//       // pending https://github.com/sveltejs/svelte/issues/2377
//       // dev && new webpack.HotModuleReplacementPlugin(),
//       new webpack.DefinePlugin({
//         'process.browser': true,
//         'process.env.NODE_ENV': JSON.stringify(mode),
//         'process.env.TARGET_ENV': JSON.stringify(
//           _.get(process.env, 'TARGET_ENV', 'production')
//         ),
//       }),
//     ].filter(Boolean),
//     devtool: dev && 'inline-source-map',
//   },
// };
