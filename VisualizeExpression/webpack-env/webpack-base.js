const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Path = require('path');

module.exports = function() {
    return {
        entry: {
            app: './src/main.ts',
            vendor: './src/vendor.ts',
            polyfills: './src/polyfills.ts'
        },

        resolve: {
            extensions: ['.ts', '.js']
        },

        output: {
            filename: '[name].js',
            publicPath: '/',
            path: Path.resolve(__dirname, '../dist')
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader!angular2-template-loader',
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                }
            ]
        },

        plugins: [
            // Issue with Angular
            // See: https://github.com/angular/angular/issues/11580
            new Webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                Path.resolve(__dirname, '../src')
            ),

            new Webpack.optimize.CommonsChunkPlugin({
                name: ['app', 'vendor', 'polyfills']
            }),

            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
}