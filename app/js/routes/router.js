/*global define */
define('routes/router', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'models/error/user'
    , 'views/error/user'
    , 'views/clear'
    , 'controllers/issue'
    , 'controllers/map'
    , 'views/menu'
], function($,_,Backbone,UserErrorModel,UserErrorView,ClearView,IssueController,MapController,MenuView) {
    'use strict';
    var Router = Backbone.Router.extend({
          pages   : {}   // config for supported pages
        , config  : {}   // global site configuration, i.e., site.json
        , issueController : null // IssueModel for this app
        , mapController   : null
        , initialize: function(opts) {
            var that    = this;
            this.config = opts.config;
            this.pages  = opts.config.pages;
            this.issueController = new IssueController({
                  router: this
                , config: this.config 
            });
            this.issueController.init().done(function() {
                // pages.router.history = true by default, if missing
                if (_.has(that.pages.router,'history') && !!that.pages.router.history) {
                    Backbone.history.start();
                }
            });
        }
        , navigate: function(fragment,options) {
            if (Backbone.history.fragment === fragment) return;
            Backbone.history.navigate(fragment,options);
        }
        , page: function(page) {
            var that = this;
            var pageConfig;
            var mapPage = false;
            try {
                if (!page) page = this.pages.home;
                pageConfig = this.pages.pages[page];
                if (pageConfig === undefined) throw new Error('Missing config in router/page');
            } catch (e) {
                return this.page('404');
            }
            new ClearView().render();
            _.each(pageConfig, function(pc) {
                var viewName;
                var args = {
                      config: that.config
                    , issue:  that.issueController.model
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
                if (viewName === 'views/map') {
                    that.mapController = new MapController(args);
                    mapPage = true;
                } else {
                    require([viewName], function(View) {
                        var v = new View(args);
                        v.render();
                    });
                }
            });
            if (!mapPage) that.mapController = null;
        }
        , article : function(id) {
            var that = this;
            var args = {
                  config: that.config
                , issue:  that.issueController.model
                , router: that
            };
            if ($('#titlepage').length > 0) {
                $('#titlepage').remove();
            }
            if ($('#page').length > 0) {
                $('#page').remove();
            }
            if (that.mapController === null) {
                that.mapController = new MapController(args);
            }
            if ($('#menu').children().length === 0) {
                new MenuView(args).render();
            }
            // select the article indicated by the url's route only after
            // the map has initialized
            that.mapController.init().done(function() {
                var article = that.issueController.model.getArticle(id); 
                article.trigger('active', article);
           });
        }
    });
    return Router;
});
