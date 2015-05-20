/*global define */
define('views/app', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var signal = {};
    var AppView = Backbone.View.extend({
        el: 'body',
        initialize: function() {
            var that = this;
            $(window).resize(function() {
                document.location.reload();
            });
        }
    });
    return AppView;
});
