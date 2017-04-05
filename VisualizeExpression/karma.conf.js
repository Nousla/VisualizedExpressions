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
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter')
    ],

    files: [
      { pattern: app + '*.spec.js', included: false, watched: true },
      
      { pattern: npm + '@angular/**/*.js', included: false, watched: false },
      { pattern: npm + '@angular/**/*.js.map', included: false, watched: false },

      npm + 'systemjs/dist/system.src.js',
      npm + 'core-js/client/shim.js',

      { pattern: src + 'systemjs.config.js', included: false, watched: false },

      { pattern: app + '*.html', included: false, watched: true },
      { pattern: app + '*.css', included: false, watched: true },
    ],

    exclude: [
    ],

    preprocessors: {
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
