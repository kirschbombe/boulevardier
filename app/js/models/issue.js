/*global define */
define('models/issue', [
    'jquery',
    'underscore',
    'backbone',
    'models/article',
    'collections/articles'
], function($,_,Backbone,ArticleModel,ArticleCollection) {
    'use strict';
    var IssueModel = Backbone.Model.extend({
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            var artdir = that.app.config.articles.pathBase;
            var files = that.app.config.articles.files;
            // TODO: fix this and models/app construction of collections
            var $colDef = that.app.singletons['collections/articles'];
            var col = new ArticleCollection(null, {model: ArticleModel, app: that.app, init: $colDef});
            that.set('collection', col);
            var deferreds = [];
            // articles constructed sync, so article objects added to list by index
            var articles = _.map(_.range(files.length), function(){return undefined;});
            _.each(files, function(file,i) {
                var $def = $.Deferred();
                deferreds.push($def);
                var args = {
                    articleid:  i,
                    articledir: artdir,
                    path:       artdir + file
                };
                that.app.fetch('models/article', args).done(function(article){
                    articles[i] = article;
                    $def.resolve(article);
                }).fail(function(){
                    $def.fail();
                });
            });
            $.when.apply({},deferreds).done(function() {
                col.add(articles);
                col.trigger('complete');
                _.each(deferreds, function($def){
                    $def.done(function(article){
                        col.add(article);
                    });
                });
                that.init.resolve(that);
            }).fail(function() {
                that.init.fail();
            });
        },
        defaults: {
            "articlefile" : "",
            "articledir"  : "",
            "collection"  : []
        },
        // show an article and the corresponding pin
        show: function(id) {
            var that = this;
            var col = that.get('collection');
            if (col.length > id ) {
                if (!col.at(id).get('active')) {
                    _.forEach(col.where({active:true}), function(article) {
                        article.unselect();
                    });
                    // this involves async initialization
                    var article = col.at(id);
                    article.init.done(function(){
                        article.select();
                        that.app.fetch('models/map').done(function(map) {
                            map.show(id);
                        });
                    });
                }
            } else {
                this.app.router.navigate("page/404", {trigger:true});
            }
        }
    });
    return IssueModel;
});
