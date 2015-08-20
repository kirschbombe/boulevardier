/*global define*/
define('views/article/gallery/popover', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/image-popover.html'
    , 'text!partials/image-popover-content.html'
], function($,_,Backbone,popoverTempl,popoverContentTempl) {
    'use strict';
    var ArticleGalleryPopoverView = Backbone.View.extend({
          id: 'article'
        , initialize: function() {}
        , remove: function() { /* retain */}
        , render: function () {
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
            return that;
        }
    });
    return ArticleGalleryPopoverView;
});
