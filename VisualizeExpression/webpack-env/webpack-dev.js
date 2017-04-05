const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack-base.js');
const Path = require('path');

module.exports = WebpackMerge(WebpackBase(), {
  devtool: 'cheap-module-source-map',
  
  output: {
      publicPath: 'http://localhost:8080',
      sourceMapFilename: '[name].map'
  },

  devServer: {
      contentBase: './src/',
      port: 8080,
      host: 'localhost',
      inline: true,
      noInfo: false,
      historyApiFallback: true
  },
})