/*global define*/
define('views/article/gallery/slides', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/image-popover.html'
    , 'text!partials/image-popover-content.html'
    , 'text!partials/lightbox-title.html'
    , 'slidesjs'
    , 'lightbox'
], function($,_,Backbone,popoverTempl,popoverContentTempl,lightboxTitleTempl) {
    'use strict';
    var ArticleGallerySlidesView = Backbone.View.extend({
          id: 'article'
        , initialize: function() {}
        , remove: function() { /* retain */}
        , render: function () {
            var that = this;
            // configure slidesjs; up to now, 'display:none'
            // has applied
            $("#slides").slidesjs({
                navigation: {
                    active: ($('img.slidesjs-slide').length > 1),
                    effect: "fade"
                },
                pagination: {
                    active: ($('img.slidesjs-slide').length > 1),
                    effect: "fade"
                },
                effect: {
                    fade: {
                      speed: 100,
                      crossfade: true
                    }
                },
                callback: {
                    // called on load of first pic
                    loaded: function(number) {
                        var $img = $(".slidesjs-control").children(':eq('+ (number - 1) + ')');
                        $img.css({visibility: "hidden"});
                        $img.css({
                              height: 'auto'
                            , width:  'auto'
                            , maxHeight: $(".slidesjs-container").height()
                            , maxWidth:  $(".slidesjs-container").width()
                            , position:  "relative"
                        });
                        var left = ($(".slidesjs-container").width() - $img.width())/2;
                        left -= parseInt($img.css('padding-left'), 10);
                        $img.css({ left: left });
                        $img.css({ visibility: "visible" });
                    },
                    // called start of change of pic (after first)
                    start: function(number) {
                        $(".slidesjs-control").children().css({visibility: "hidden"});
                    },
                    // called end of change of pic (after first)
                    complete: function(number) {
                        var newImg = number - 1;
                        var $img = $(".slidesjs-control").children(':eq('+ newImg + ')');
                        $img.css({
                              height: 'auto'
                            , width:  'auto'
                            , maxHeight: $(".slidesjs-container").height()
                            , maxWidth:  $(".slidesjs-container").width()
                            , position:  "relative"
                        });
                        $img.css({ visibility: "visible" });
                    }
                }
            });
            return that;
        }
    });
    return ArticleGallerySlidesView;
});
