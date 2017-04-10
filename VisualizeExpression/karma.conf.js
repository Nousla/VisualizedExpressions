var npm = 'node_modules/';
var src = "src/";
var app = "src/app/";

module.exports = function (config) {
    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-jasmine-html-reporter')
        ],

        files: [
            { pattern: 'karma-test-shim.js', watched: false }
        ],

        exclude: [
        ],

        webpack: require('./webpack-env/webpack-test'),

        webpackMiddleware: {
            stats: 'errors-only'
        },

        preprocessors: {
            'karma-test-shim.js': ['webpack']
        },

        reporters: ['kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}