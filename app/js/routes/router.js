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
        initialize: function(opts) {
            this.app = opts.app;
            this.pages = this.app.config.pages;
            Backbone.history.start();
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
                    if (_.has(pc, 'view')) {
                        viewName = pc.view;
                        args = {};
                    } else if (_.has(pc, 'partial')) {
                        viewName = 'views/partial';
                        pc.partial.page = that.app.config.pages.pathBase + pc.partial.page;
                        args = pc.partial;
                    } else if (_.has(pc, 'full')) {
                        window.location.href =pc.full.page;
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
