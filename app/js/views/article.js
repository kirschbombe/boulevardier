/*global define*/
define('views/article', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'views/article/gallery'
    , 'mixins/xml2html'
    , 'text!xsl/article.xsl'
], function($,_,Backbone,GalleryView,XML2HTML,xsl) {
    'use strict';
    var ArticleView = Backbone.View.extend({
        id: 'article',
        initialize: function(args) {
            var that = this;
            that.config = args.config;
        },
        render: function () {
            var that = this;
            that.$el = $('#' + that.id);
            if (that.$el.find('#' + that.model.cid).length !== 0)
                return;
            var html = this.xml2html(
                this.model.get('xml'), xsl, 
                {"article-dir": that.config.articles.pathBase
                , "iconUrl"    : that.model.get('iconUrl')
                , "cid"        : that.model.cid
                }
            );
            try {
                $('.article-content').remove();
                $('#'+this.id).append(html);
            } catch (e) {
                console.log("article load error: " + e.toString());
            }
            if ( $('img.slidesjs-slide').length > 0) {
                new GalleryView().render();
            } else {
                $('#footer').remove()
                $('article').removeClass('before-footer').addClass('no-footer');
            }
            that.$el.find('.article-marker').click(function(i,elt) {
                that.model.trigger('toggle', that.model);
            });
            return that;
        },
        remove: function() { /* retain */},
    });
    _.extend(ArticleView.prototype,XML2HTML);
    return ArticleView;
});
