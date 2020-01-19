const webpack = require('webpack');
const path = require('path');
const { resolve, mode } = require('./scripts/bundler/env');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      {
        test: /\.m?js$/,
        include: filepath => {
          // include src/** and node_modules/svelte/**
          // exclude everything else
          const svelte = resolve('node_modules', 'svelte');
          const src = resolve('src');

          const testNested = (parent, child) => {
            const relative = path.relative(parent, child);
            return (
              relative &&
              !relative.startsWith('..') &&
              !path.isAbsolute(relative)
            );
          };

          if (testNested(src, filepath)) {
            return true;
          } else if (testNested(svelte, filepath)) {
            return true;
          }
          return false;
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
    }),
  ].filter(Boolean),

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  devServer: {
    publicPath: '/assets/',
    contentBase: resolve('__tw__'),
    historyApiFallback: {
      index: 'index.html',
    },
    liveReload: true,
    hot: false,
    watchContentBase: true,
    writeToDisk: true,
  },
};
