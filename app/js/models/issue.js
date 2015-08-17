/*global define */
define('models/issue', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'models/article'
    , 'collections/articles'
    , 'mixins/asyncInit'
], function($,_,Backbone,ArticleModel,ArticleCollection,AsyncInit) {
    'use strict';
    var IssueModel = Backbone.Model.extend({
        initialize: function(args) {
            var that    = this;
            that.$def   = $.Deferred();
            var artdir  = args.config.articles.pathBase;
            if (!artdir.match(/\/$/)) artdir += '/';
            var files   = args.config.articles.files;
            var col     = new ArticleCollection();
            that.config = args.config;
            that.set('collection', col);
            // fix length of articles array
            var articles = _.map(_.range(files.length), function(){return undefined;});
            // articles constructed sync, so article objects added to list by index
            _.each(files, function(file,i) {
                articles[i] = new ArticleModel({
                    articleid:  i,
                    articledir: artdir,
                    path:       artdir + file
                });
            });
            var inits = _.map(articles, function(article){return article.init();});
            $.when.apply(null,inits).done(function() {
                col.add(articles);
                that.setIcons();
                that.$def.resolve(that);
            }).always(function() {
                _.forEach(inits, function($promise){
                    if ($promise.state() === 'rejected')
                        that.$def.reject();
                });
                that.$def.reject(); // not re-set on failure
            });
        }
        // map marker icons filename values are set here; icon colors are assigned
        // randomly, so to support a consistency between the color and the place-type
        // layer, they must be assigned as a group
        , setIcons: function() {
            var that = this;
            var icconfig  = that.config.markers.icons;
            var iconFiles = _.shuffle(_.flatten(
                _.map(icconfig, function(entry) {
                    return _.map(entry.files, function(file) {
                        return entry.dir.concat(file);
                    });
                })
            ));
            var defaultIconFile = iconFiles.pop();
            var icons = [];
            // do map marker icon initialization; this seems like it should
            // be isolated to the MapView or MarkerView, but is data used
            // elsewhere in the application, so they are assigned here
            that.get('collection').forEach(function(article,i) {
                var geojson = (article.getGeojson() || {"properties":{}});
                var layer = geojson.properties.layer;
                icons[layer] = icons[layer] || iconFiles.pop() || defaultIconFile;
                article.set('iconUrl', icons[layer]);
            });
        }
        // return article object corresponding to argument;
        // argument may be either an index into the collection
        // (e.g., when provided by a url) or an ArticleModel
        // (e.g., when selected by a map marker) 
        , getArticle: function(article) {
            var art;
            var col = this.get('collection');
            if (typeof article === 'object') {
                art = article;
            } else if (typeof article === 'number' || typeof article === 'string') {
                art = col.at(article);
            }
            return art;
        }
    });
    _.extend(IssueModel.prototype,AsyncInit);
    return IssueModel;
});
