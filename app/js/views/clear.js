/*global define*/
define('views/clear', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone,tmpl) {
    'use strict';
    var ClearView = Backbone.View.extend({
        el: 'body',
        render: function() {
            $('body').empty();
        }
    });
    return ClearView;
});
