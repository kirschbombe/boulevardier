/*global define*/
define('views/article', [
    'jquery',
    'underscore',
    'backbone',
    'mixins/domwatcher',
    'mixins/xml2html',
    'text!xsl/article.xsl',
    'text!partials/popover.html',
    'text!partials/popover-content.html',
    'slidesjs'
], function($,_,Backbone,DOMWatcher,XML2HTML,xsl,popoverTempl,popoverContentTemp) {
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
            var html = this.xml2html(
                this.model.get('xml'),
                xsl,
                {"article-dir": that.config.articles.pathBase}
            );
            try {
                $('.article-content').remove();
                $('#'+this.id).append(html);
            } catch (e) {
                console.log("article load error: " + e.toString());
            }
            if ( $('img.slidesjs-slide').length === 0) {
                $('#footer').remove()
                $('article').removeClass('before-footer').addClass('no-footer');
            } else {
                try {
                    that.postprocess();
                } catch (e) {
                    throw new Error("Failed to handle article images");
                }
            }
            return that;
        },
        remove: function() { /* retain */},
        postprocess: function() {
            var that = this;
            // adjust height of article body
            // TODO: handle in css
            var height = $('#article article').height() - $('#header').outerHeight(true);
            $('#body').css({height:height});
            // add popovers to images
            var pct = _.template(popoverContentTemp);
            $('img.slidesjs-slide').each(function(i,elt) {
                var id = elt.getAttribute('id');
                var $po = $('.popover.' + id).remove();
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
            return that;
        }
    });
    _.extend(ArticleView.prototype,DOMWatcher);
    _.extend(ArticleView.prototype,XML2HTML);
    return ArticleView;
});
