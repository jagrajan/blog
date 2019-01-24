/* eslint-disable */
const path = require('path');

module.exports = {
  // javascript will be run in a node environment
  target: 'node',
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs',
  },
  // exclude npm packages as they will be available in the environemnt
  externals: [/^[a-z]/],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
    ],
  },
  devtool: 'source-map',
}