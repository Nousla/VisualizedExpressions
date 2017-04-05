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
            { pattern: app + '*.spec.ts', included: false, watched: true },

            { pattern: npm + '@angular/**/*.js', included: false, watched: false },
            { pattern: npm + '@angular/**/*.js.map', included: false, watched: false },

            npm + 'core-js/client/shim.js',

            { pattern: app + '*.html', included: false, watched: true },
            { pattern: app + '*.css', included: false, watched: true },
        ],

        exclude: [
        ],

        webpack: require('./webpack-env/webpack-test'),

        preprocessors: {
            '**/*.spec.ts': ['webpack']
        },

        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}