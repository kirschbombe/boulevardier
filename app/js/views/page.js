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
