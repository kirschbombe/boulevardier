/*global define*/
define('views/article/gallery', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'views/article/gallery/popover'
    , 'views/article/gallery/lightbox'
    , 'views/article/gallery/slides'
], function($,_,Backbone,ArticleGalleryPopoverView,ArticleGalleryLightboxView,ArticleGallerySlidesView) {
    'use strict';
    var ArticleGalleryView = Backbone.View.extend({
          id: 'article'
        , initialize: function() {}
        , remove: function() { /* retain */}
        , render: function () {
            var that = this;
            // adjust height of article body
            // TODO: handle in css
            var height = $('#article article').height() - $('#header').outerHeight(true);
            $('#body').css({height:height});
            
            // remove images that fail to load, since we cannot do
            // a file test when running the xsl
            var defs = [];
            $('img.slidesjs-slide').each(function(i,img){
                var $def = $.Deferred();
                $(img).load(function(){
                    $(img).removeClass('remove');
                    $def.resolve();
                });
                $(img).error(function(){
                    // allow some time before failure
                    window.setTimeout(function(){
                        $def.reject();
                    },500);
                });
                defs.push($def);
            });
            $.when.apply({},defs).always(function(){
                $('img.slidesjs-slide.remove').remove();
                $('.image-loading').removeClass('image-loading');
                new ArticleGalleryPopoverView().render();
                new ArticleGalleryLightboxView().render();
                new ArticleGallerySlidesView().render();
            });
        }
    });
    return ArticleGalleryView;
});
