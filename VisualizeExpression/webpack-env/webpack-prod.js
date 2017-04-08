const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack-base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = WebpackMerge(WebpackBase(), {
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({comments: true}),
		
		new HtmlWebpackPlugin({
			template: './src/index.ejs',
			baseUrl: 'https://goodfoamy.github.io/Bachelor/'
		})
    ]
});