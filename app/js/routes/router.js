/*global define */
define('routes/router', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'models/error/user'
    , 'views/error/user'
    , 'views/clear'
    , 'views/issue'
    , 'views/map'
    , 'views/menu'
], function($,_,Backbone,UserErrorModel,UserErrorView,ClearView,IssueView,MapView,MenuView) {
    'use strict';
    var Router = Backbone.Router.extend({
        pages   : {},   // config for supported pages
        config  : {},   // global site configuration, i.e., site.json
        issue   : null, // IssueModel for this app
        mapView : null, // MapView
        initialize: function(opts) {
            var that    = this;
            this.config = opts.config;
            this.pages  = opts.config.pages;
            this.issue  = opts.issue;
            this.issue.init().done(function() {
                // pages.router.history = true by default, if missing
                if (_.has(that.pages.router,'history') && !!that.pages.router.history) {
                    Backbone.history.start();
                }
            });
        },
        navigate: function(fragment,options) {
            if (Backbone.history.fragment === fragment) return;
            Backbone.history.navigate(fragment,options);
        },
        page: function(page) {
            var that = this;
            var pageConfig;
            try {
                if (!page) page = this.pages.home;
                pageConfig = this.pages.pages[page];
                if (pageConfig === undefined) throw new Error('Missing config in router/page');
            } catch (e) {
                return this.page('404');
            }
            // clear the <body>
            (new ClearView()).render();
            _.each(pageConfig, function(pc) {
                var viewName;
                var args = {
                      config: that.config
                    , issue:  that.issue
                    , router: that
                };
                // clone config to avoid global changes
                var config = JSON.parse(JSON.stringify(pc));
                if (_.has(config, 'view')) {
                    viewName = config.view;
                } else if (_.has(config, 'partial')) {
                    viewName = 'views/partial';
                    config.partial.page = that.pages.pathBase + config.partial.page;
                    args = _.extend(args,config.partial);
                } else if (_.has(confg, 'full')) {
                    window.location.href = config.full.page;
                    return;
                } else {
                    throw new Error('Unsupported page type in router: ' + page);
                }
                require([viewName], function(View) {
                    var v = new View(args);
                    v.render();
                });
            });
        },
        article : function(id) {
            $('#titlepage').remove();
            var that = this;
            var args = {
                  config: that.config
                , issue:  that.issue
                , router: that
            };
            if ($('#issue').length === 0) {
                var isv = new IssueView(args);
                isv.render();
            }
            if ($('#map').length === 0) {
                that.mapView = new MapView(args);
                that.mapView.render();
            }
            if ($('#menu').children().length === 0) {
                var mnv = new MenuView(args);
                mnv.render();
            }
            // select the article indicated by the url's route only after
            // the map has initialized
            $.when.apply({},[that.mapView.init()]).done(function() {
                that.issue.trigger('select', id);
           });
        }
    });
    return Router;
});
