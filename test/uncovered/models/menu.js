/*global define */
define('models/menu', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MenuModel = Backbone.Model.extend({
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            that.init.resolve(that);
        },
        defaults: {
            "items" : []
        }
    });
    return MenuModel;
});
