const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack-base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = WebpackMerge(WebpackBase(), {
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader!angular2-template-loader',
				exclude: [/\.(spec|e2e)\.ts$/]
			}
		]
	},

	plugins: [
		new Webpack.optimize.UglifyJsPlugin({ comments: true }),

		new Webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),

		new HtmlWebpackPlugin({
			template: './src/index.ejs',
			baseUrl: 'https://goodfoamy.github.io/Bachelor/'
		})
	]
});