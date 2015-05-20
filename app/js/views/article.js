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
        el: '#article',
        initialize: function(opts) {
            var that = this;
            that.app = opts.model.app;
            that.listenToOnce(that.model, 'active', that.render);
            that.listenToOnce(that.model, 'inactive', that.remove);
        },
        render: function (params) {
            var that = this;
            var html = this.xml2html(
                this.model.get('xml'),
                xsl,
                {"article-dir": that.app.config.articles.pathBase}
            );
            that.$el.append(html);
            if ( $('img.slidesjs-slide').length === 0) {
                $('#footer').remove()
                $('article').removeClass('before-footer').addClass('no-footer');
            } else {
                that.postprocess();
            }
        },
        postprocess: function() {
            var that = this;
            // add popovers to images
            var pct = _.template(popoverContentTemp);
            $('img.slidesjs-slide').each(function(i,elt) {
                var id = elt.getAttribute('id');
                var $po = $('.popover.' + id).remove();
                var title = $po.find('.head').text();
                var content = pct({
                    desc: $po.find('.desc').text(),
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
                    // allow time before all the deferreds fail --
                    // this is just to simplify debugger path errors
                    window.setTimeout(function(){
                        $def.reject();
                    },500);
                });
                defs.push($def);
            });
            $.when.apply({},defs).always(function(){
                $('img.slidesjs-slide.remove').remove();
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
                            $img.css({ height: $(".slidesjs-container").height(), width: "auto" });
                            var left = ($(".slidesjs-container").width() - $img.width())/2;
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
                            $img.css({ height: $(".slidesjs-container").height(), width: "auto", position: "relative"});
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
