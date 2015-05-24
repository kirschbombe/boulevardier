/*global define */
define('models/issue', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'models/article'
    , 'collections/articles'
    , 'mixins/asyncInit'
    , 'views/article'
], function($,_,Backbone,ArticleModel,ArticleCollection,AsyncInit,ArticleView) {
    'use strict';
    var IssueModel = Backbone.Model.extend({
        initialize: function(args) {
            var that    = this;
            that.$def   = $.Deferred();
            var artdir  = args.config.articles.pathBase;
            var files   = args.config.articles.files;
            var col     = new ArticleCollection();
            that.config = args.config;
            that.set('collection', col);
            var inits = [];
            // fix length of articles array
            var articles = _.map(_.range(files.length), function(){return undefined;});
            // articles constructed sync, so article objects added to list by index
            _.each(files, function(file,i) {
                articles[i] = new ArticleModel({
                    articleid:  i,
                    articledir: artdir,
                    path:       artdir + file
                });
                inits.push(articles[i].init());
            });
            $.when.apply({},inits).done(function() {
                col.add(articles);
                col.trigger('complete');
                that.on('select', function(article) {
                    that._selectArticle(article);
                });
                that.$def.resolve(that);
            }).fail(function() {
                that.$def.fail();
            });
        },
        defaults: {
            "activeArticle" : null
        },
        // show an article and the corresponding pin
        // article may be either an index into the collection
        // (e.g., when provided by a url) or an ArticleModel
        // (e.g., when selected by a map marker)
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
            // avoid un- and re-rendering an already-viewed article
            if ((this.get('activeArticle') !== null) &&
                (this.get('activeArticle') ==  article))
            {
                return;
            } else {
                if (this.get('activeArticle')) this.get('activeArticle').unselect();
                that.set('activeArticle', art);
            }
            // this involves async initialization
            art.init().done(function() {
                // TODO: review whether this is the best place to create a new
                // view for an article
                var av = new ArticleView({
                      model: art
                    , config: that.config
                    , issue:  that
                    , router: that.router
                });
                art.on('active',   av.render, av);
                art.on('inactive', av.remove, av);
                art.select();
            });
        }
    });
    _.extend(IssueModel.prototype,AsyncInit);
    return IssueModel;
});
