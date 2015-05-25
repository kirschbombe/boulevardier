// Karma configuration
// Generated on Sat May 23 2015 10:04:47 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'test/test-main.js',
        {pattern: 'test/lib/jquery/dist/jquery.js'  , included:  true}
      , {pattern: 'test/**/*.js'                    , included: false}
      , {pattern: 'test/**/*.json'                  , included: false}
      , {pattern: 'test/fixtures/**/*.*'            , included: false, watched: true, served: true}

      , {pattern: 'app/js/**/*.js'                  , included: false}
      , {pattern: 'app/partials/**/*.html'          , included: false}
      , {pattern: 'app/pages/**/*.html'             , included: false}
      , {pattern: 'app/script/**/*.xsl'             , included: false}
    ],

    // list of files to exclude
    exclude: [
      'app/js/main.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    hostname: 'localhost',
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome'],
    //browsers: ['Firefox'],
    //browsers: ['Chrome', 'Safari'],
    browsers: ['Chrome', 'Firefox', 'Safari'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
