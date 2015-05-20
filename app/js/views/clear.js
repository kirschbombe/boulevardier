/*global define*/
define('views/clear', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone,tmpl) {
    'use strict';
    var ClearView = Backbone.View.extend({
        el: 'body',
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            that.init.resolve(that);
        },
        render: function() {
            $('body').empty();
        }
    });
    return ClearView;
});
