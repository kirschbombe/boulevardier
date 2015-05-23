/*global define */
define('routes/router', [
    'jquery',
    'underscore',
    'backbone',
    'models/error/user',
    'views/error/user'
], function($,_,Backbone,UserErrorModel,UserErrorView) {
    //'use strict';
    var Router = Backbone.Router.extend({
        app     : null,
        pages   : {},   // config for supported pages
        config  : {},
        initialize: function(opts) {
            this.app = opts.app;
            this.config = opts.config;
            this.pages = this.app.config.pages;
            // pages.router.history = true by default, if missing
            if (_.has(this.config,'history') && !!this.config.history) Backbone.history.start();
        },
        navigate: function(fragment,options){
            if (Backbone.history.fragment === fragment) return;
            Backbone.history.navigate(fragment,options);
        },
        page: function(page) {
            var that = this;
            var pageConfig;
            try {
                if (!page) page = this.pages.home;
                pageConfig = this.pages.pages[page];
                if (pageConfig === undefined) throw "missing config";
            } catch (e) {
                return this.page('404');
            }
            // do an automatic clear of body for any pages
            var $def = $.Deferred();
            that.app.fetch('views/clear').done(function(view) {
                view.render();
                $def.resolve();
            });
            $def.done(function(){
                _.each(pageConfig, function(pc) {
                    var viewName, args;
                    // clone config to avoid global changes
                    var conifg = JSON.parse(JSON.stringify(pc));
                    if (_.has(conifg, 'view')) {
                        viewName = conifg.view;
                        args = {};
                    } else if (_.has(conifg, 'partial')) {
                        viewName = 'views/partial';
                        conifg.partial.page = that.app.config.pages.pathBase + conifg.partial.page;
                        args = conifg.partial;
                    } else if (_.has(conifg, 'full')) {
                        window.location.href = conifg.full.page;
                        return;
                    } else {
                        throw "unsupported page type: " + page;
                    }
                    that.app.fetch(viewName, args).done(function(view) {
                        view.render();
                    });
                });
            });
        },
        article : function(id) {
            $('#titlepage').remove();
            var that = this;
            var deferreds = [];
            _.each(["views/issue", "views/map", "views/menu"], function(viewName) {
                var $def = $.Deferred();
                deferreds.push($def);
                that.app.fetch(viewName).done(function(view) {
                    view.render();
                    $def.resolve();
                });
            });
            $.when.apply({},deferreds).done(function() {
                that.app.fetch('models/issue').done(function(issue) {
                    issue.trigger('select', id);
                });
            }).fail(function() {
                console.log("Failed to display article: " + id);
            });
        }
    });
    return Router;
});
