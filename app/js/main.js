require.config({
  paths: {
      backbone  : '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min'
    , bootstrap : '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min'
    , d3        : '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min'
    , jquery    : '//code.jquery.com/jquery-2.1.4.min'
    //, leaflet   : '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet'
    , leaflet   : 'leaflet-src'
    
    , lightbox  : '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.0/jquery.magnific-popup.min'
    , slidesjs  : '//cdnjs.cloudflare.com/ajax/libs/slidesjs/3.0/jquery.slides.min'
    , text      : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'
    , underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min'
    , partials  : '../partials'
    , xsl       : '../script/xsl'
    , pages     : '../pages'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    backbone: {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    },
    underscore: {
        'exports': '_'
    },
    text: {
        'deps': []
    },
    slidesjs: {
        deps: ['jquery']
    },
    lightbox: {
      deps: ['jquery']
    }
  }
});
require([
    'jquery',
    'models/error/user',
    'views/error/user',
    'routes/router',
    'views/app',
    'bootstrap'
], function($,UserErrorModel,UserErrorView,Router,AppView) {
    'use strict';
    var configfile = $('#main').attr('data-config');
    if (configfile) {
        $.getJSON(configfile, function(siteconfig) {
            try {
                new AppView();
                new Router({
                      routes: siteconfig.pages.routes
                    , config: siteconfig
                });
            } catch (e) {
                if (!siteconfig.debug) {
                    new UserErrorView({
                        model: new UserErrorModel({
                            msg: e.toString()
                        })
                    });
                }
            }
        }).fail(function(jqxhr, textStatus, error) {
            new UserErrorView({
                model: new UserErrorModel({
                    msg: "Failed to load site config file '" + configfile + "' " + error
                })
            });
        });
    } else {
        new UserErrorView({
            model: new UserErrorModel({
                msg: "No configuration filename specified in home page."
            })
        });
    }
});
