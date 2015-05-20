/* global mocha, window */
require.config({
  hbs: {
    disableHelpers: true,
    disableI18n: true,
    templateExtension: 'html'
  },
  paths: {
    chai: '../lib/chai',
    mocha: '../lib/mocha/mocha',
    app: '../js/app',
    jquery: '../components/jquery/dist/jquery',
    bootstrapAffix: '../components/bootstrap/js/affix',
    bootstrapAlert: '../components/bootstrap/js/alert',
    bootstrapButton: '../components/bootstrap/js/button',
    bootstrapCarousel: '../components/bootstrap/js/carousel',
    bootstrapCollapse: '../components/bootstrap/js/collapse',
    bootstrapDropdown: '../components/bootstrap/js/dropdown',
    bootstrapModal: '../components/bootstrap/js/modal',
    bootstrapPopover: '../components/bootstrap/js/popover',
    bootstrapScrollspy: '../components/bootstrap/js/scrollspy',
    bootstrapTab: '../components/bootstrap/js/tab',
    bootstrapTooltip: '../components/bootstrap/js/tooltip',
    bootstrapTransition: '../components/bootstrap/js/transition',
    backbone: '../components/backbone-amd/backbone',
    underscore: '../components/underscore-amd/underscore',
    hbs: '../components/require-handlebars-plugin/hbs',
    json2: '../components/require-handlebars-plugin/hbs/json2',
    i18nprecompile: '../components/require-handlebars-plugin/hbs/i18nprecompile',
    handlebars: '../components/require-handlebars-plugin/Handlebars'
  },
  deps: [
    'chai',
    'mocha'
  ],
  shim: {
    bootstrapAffix: {
      deps: ['jquery']
    },
    bootstrapAlert: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapButton: {
      deps: ['jquery']
    },
    bootstrapCarousel: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapCollapse: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapDropdown: {
      deps: ['jquery']
    },
    bootstrapModal: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapPopover: {
      deps: ['jquery', 'bootstrapTooltip']
    },
    bootstrapScrollspy: {
      deps: ['jquery']
    },
    bootstrapTab: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapTooltip: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapTransition: {
      deps: ['jquery']
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});

require(['require', 'chai', 'mocha'], function(require) {
  'use strict';

  mocha.setup('bdd');
  require([
    '../spec/test.js'
  ], function() {
    if (window.mochaPhantomJS) {
      var mochaPhantomJS = window.mochaPhantomJS;
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  });
});
