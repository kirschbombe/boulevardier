/*global define */
define('models/menu', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MenuModel = Backbone.Model.extend({
        defaults: {
            "items" : []
        }
    });
    return MenuModel;
});
