var allTestFiles = [];
var TEST_REGEXP = /test\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

var paths = {
      'jquery'      : 'test/lib/jquery/jquery'
    , 'underscore'  : 'test/lib/underscore/underscore'
    , 'backbone'    : 'test/lib/backbone/backbone'
    , 'bootstrap'   : 'test/lib/bootstrap/dist/js/bootstrap'
    , 'text'        : 'test/lib/requirejs-text/text'
    , 'leaflet'     : 'test/lib/leaflet/dist/leaflet'
    , 'slidesjs'    : 'test/lib/Slides-SlidesJS-3/source/jquery.slides'
    , 'partials'    : 'app/partials'
    , 'config'      : 'test/config'
    , 'xsl'         : 'app/script/xsl'
    , 'pages'       : 'app/pages'
    , 'fixtures'    : 'test/fixtures'
    , 'utils'       : 'test/lib/utils'
};

// 'collections/markers'   : 'app/js/collections/markers',
Object.keys(window.__karma__.files).forEach(function(file) {
    if (file.match(/^\/base\/app\/js/)) {
        var name = file.replace(/^\/base\/app\/js\//, '').replace(/\.js$/, '');
        var path = file.replace(/^\/base\//, '').replace(/\.js$/, '');
        paths[name] = path;
    }
});

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base'
  , paths: paths
  , shim: {
    bootstrap: {
      deps: ['jquery']
    }
    , backbone: {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    }
    , underscore: {
        'exports': '_'
    }
    , text: {
        'deps': []
    }
    , slidesjs: {
        deps: ['jquery']
    }
  }

  // dynamically load all test files
  , deps: allTestFiles

  // we have to kickoff jasmine, as it is asynchronous
  , callback: window.__karma__.start
});
