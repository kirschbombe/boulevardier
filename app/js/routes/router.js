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
    //'use strict';
    var Router = Backbone.Router.extend({
        pages   : {},   // config for supported pages
        config  : {},   // global site configuration, i.e., site.json
        issue   : null, // IssueModel for this app
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
                var conifg = JSON.parse(JSON.stringify(pc));
                if (_.has(conifg, 'view')) {
                    viewName = conifg.view;
                } else if (_.has(conifg, 'partial')) {
                    viewName = 'views/partial';
                    conifg.partial.page = that.pages.pathBase + conifg.partial.page;
                    args = _.extend(args,conifg.partial);
                } else if (_.has(conifg, 'full')) {
                    window.location.href = conifg.full.page;
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
            var isv = new IssueView(args);
            isv.render();
            var mpv = new MapView(args);
            mpv.render();
            var mnv = new MenuView(args);
            mnv.render();
            that.issue.trigger('select', id);
        }
    });
    return Router;
});
