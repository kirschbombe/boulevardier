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
                that.app.fetch('models/article', args).done(function(articleModel){
                    articles[i] = articleModel;
                    that.app.fetch('views/article', {model:articleModel}).done(function(articleView) {
                        articleModel.on('active',articleView.render,articleView);
                        articleModel.on('inactive',articleView.remove,articleView);
                    });
                    $def.resolve();
                }).fail(function(){
                    $def.fail();
                });
            });
            $.when.apply({},deferreds).done(function() {
                col.add(articles);
                col.trigger('complete');
                that.on('select', function(article) {
                    that._selectArticle(article);
                });
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
            "collection"  : [],
            "activeArticle" : null
        },
        // show an article and the corresponding pin
        _selectArticle: function(article) {
            var that = this;
            var col = that.get('collection');
            var art;
            if (typeof article === 'object') {
                art = article;
            } else if (typeof article === 'number' || typeof article === 'string') {
                art = col.at(article);
            } else {
                throw "Bad argument to models/issue";
            }
            if ((this.get('activeArticle') !== null) &&
                (this.get('activeArticle') == article))
            {
                return;
            } else {
                that.set('activeArticle', art);
            }
            _.forEach(col.models, function(article) {
                article.trigger('inactive');
            });
            // this involves async initialization
            art.init.done(function() {
                art.trigger('active');
            });
        }
    });
    return IssueModel;
});
