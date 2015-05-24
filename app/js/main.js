require.config({
  paths: {
    text:       '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
    jquery:     '//code.jquery.com/jquery-2.1.4.min',
    bootstrap:  '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
    backbone:   '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
    underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
    leaflet:    '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet',
    slidesjs:   '//cdnjs.cloudflare.com/ajax/libs/slidesjs/3.0/jquery.slides.min',
    partials:   '../partials',
    xsl:        '../script/xsl',
    pages:      '../pages'
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
    }
  }
});
require([
    'jquery',
    'models/error/user',
    'views/error/user',
    'models/app',
    'views/app',
    'bootstrap'
], function($,UserErrorModel,UserErrorView,AppModel,AppView) {
    'use strict';
    var configfile = $('#main').attr('data-config');
    if (configfile) {
        $.getJSON(configfile, function(siteconfig) {
            try {
                var app = new AppView({
                    model: (new AppModel({config: siteconfig}))
                });
            } catch (e) {
                if (!opts.config.debug) {
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
