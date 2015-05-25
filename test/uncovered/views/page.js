/*global define*/
define('views/page', [
    'jquery', 
    'underscore', 
    'backbone',
    'mixins/domwatcher',
    'text!partials/page.html'
], function($,_,Backbone,DOMWatcher,page) {
    'use strict';
    var PageView = Backbone.View.extend({
        el: 'body',
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            that.init.resolve(that);
        },
        render: function () {
            var that = this;
            var $def = $.Deferred();
            $def.then(function() {
                $(that.el).append(page);
            });
            this.watchDOM(1000,that.el,$def);
        }
    });
    _.extend(PageView.prototype,DOMWatcher);
    return PageView;
});
