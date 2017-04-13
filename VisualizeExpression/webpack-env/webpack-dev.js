const WebpackMerge = require('webpack-merge');
const Webpack = require('webpack');
const WebpackBase = require('./webpack-base.js');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = WebpackMerge(WebpackBase(), {
    devtool: 'cheap-module-source-map',

    output: {
        publicPath: 'http://localhost:8080/',
        sourceMapFilename: '[name].map'
    },

    devServer: {
        port: 8080,
        host: 'localhost',
        inline: true,
        noInfo: false,
        historyApiFallback: true,
        contentBase: [Path.resolve(__dirname, '../src')]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
			baseUrl: '/'
        })
    ]
})