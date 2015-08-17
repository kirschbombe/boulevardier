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
        },
        postprocess: function() {
            var that = this;
            // add popovers to images
            var pct = _.template(popoverContentTempl);
            $('img.slidesjs-slide').each(function(i,elt) {
                var id = elt.getAttribute('id');
                var $po = $('.popover.' + id);
                var title = $po.find('.head').text();
                $(elt).attr('alt', $po.find('.desc').text());
                var content = pct({
                    attr: $po.find('.attr').text()
                });
                $(elt).popover({
                    container: "body",
                    html : true,
                    content: content,
                    title: title,
                    template: popoverTempl,
                    trigger: "hover",
                    placement: "left"
                });
                $(elt).click(function(evt) {
                    $(elt).popover('hide');
                });
            });
            // remove images that fail to load, since we cannot do
            // a file test when running the xsl
            var defs = [];
            that.$el.find('img.slidesjs-slide').each(function(i,img){
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
            });
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
    return ArticleGalleryView;
});
