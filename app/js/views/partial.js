/*global define*/
define('views/partial', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'mixins/domwatcher'
    , 'mixins/asyncInit'
], function($,_,Backbone,DOMWatcher,AsyncInit) {
    'use strict';
    var PartialView = Backbone.View.extend({
        el: '',
        page: '',
        initialize: function(opts) {
            var that  = this;
            that.el   = opts.el;
            that.$def = $.Deferred();
            require(['text!' + opts.page], function(html) {
                that.page = html;
                that.$def.resolve(that);
            });
        },
        render: function () {
            var that = this;
            var $watchDef = $.Deferred();
            that.init().then(function() {
                $(that.el).append(that.page);
            });
            this.watchDOM(1000,that.el,$watchDef);
        }
    });
    _.extend(PartialView.prototype,DOMWatcher);
    _.extend(PartialView.prototype,AsyncInit);
    return PartialView;
});
