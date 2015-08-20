/*global define*/
define('views/article/gallery/lightbox', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/lightbox-title.html'
    , 'lightbox'
], function($,_,Backbone,lightboxTitleTempl) {
    'use strict';
    var ArticleGalleryLightboxView = Backbone.View.extend({
          id: 'article'
        , initialize: function() {}
        , remove: function() { /* retain */}
        , render: function () {
            var that = this;
            $('.gallery-item').magnificPopup({
                type: 'image',
                gallery:{
                    enabled: true
                },
                image: {
                    titleSrc: function($item) {
                        var id = $item.el.attr('id');
                        var $po = $('.popover.' + id);
                        var pct = _.template(lightboxTitleTempl);
                        var content = pct({
                            title: $po.find('.head').text(),
                            attr: $po.find('.attr').text()
                        });
                        return content;
                    }
                }
            });
            $('.glyphicon.glyphicon-expand').on('click', function(evt){
                $('.gallery-item').magnificPopup('open');
            });
            return that;
        }
    });
    return ArticleGalleryLightboxView;
});
