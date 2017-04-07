const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack-base.js');

module.exports = WebpackMerge(WebpackBase(), {
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({comments: true})
    ]
});