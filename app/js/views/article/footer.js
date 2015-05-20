/*global define*/
define('views/article/footer', [
    'jquery',
    'underscore',
    'backbone',
    'text!xsl/footer.xsl',
    'text!partials/popover.html',
    'text!partials/popover-content.html',
    'mixins/xml2html',
    'mixins/domwatcher',
    'slidesjs'
], function($,_,Backbone,xsl,popoverTempl,popoverContentTemp,XML2HTML,DOMWatcher) {
    'use strict';
    var FooterView = Backbone.View.extend({
        id: 'footer',
        tagName: 'div',
        xsl: xsl,
        name: 'footer',
        app: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
        },
    });
    _.extend(FooterView.prototype,XML2HTML);
    _.extend(FooterView.prototype,DOMWatcher);
    return FooterView;
});
