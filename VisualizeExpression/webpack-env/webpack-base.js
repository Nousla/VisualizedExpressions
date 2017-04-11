const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = function () {
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
            publicPath: '',
            path: Path.resolve(__dirname, '../dist')
        },

        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: Path.resolve(__dirname, '../src/app/'),
                    loader: ExtractTextWebpackPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.css$/,
                    include: Path.resolve(__dirname, '../src/app/'),
                    loader: 'raw-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
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
            new ExtractTextWebpackPlugin('styles.css')
        ]
    }
}