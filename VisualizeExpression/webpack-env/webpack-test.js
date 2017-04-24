const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack-base.js');

module.exports = WebpackMerge(WebpackBase(), {
  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader!angular2-template-loader',
      }
    ]
  }
});