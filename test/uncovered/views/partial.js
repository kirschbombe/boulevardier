/*global define*/
define('views/partial', [
    'jquery', 
    'underscore', 
    'backbone',
    'mixins/domwatcher'
], function($,_,Backbone,DOMWatcher) {
    'use strict';
    var PartialView = Backbone.View.extend({
        el: '',
        app: null,
        init: null,
        page: '',
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            that.el = opts.el;
            require(['text!' + opts.page], function(html) {
                that.page = html;
                that.init.resolve(that);
            });
        },
        render: function () {
            var that = this;
            var $def = $.Deferred();
            $def.then(function() {
                $(that.el).append(that.page);
            });
            this.watchDOM(1000,that.el,$def);
        }
    });
    _.extend(PartialView.prototype,DOMWatcher);
    return PartialView;
});
