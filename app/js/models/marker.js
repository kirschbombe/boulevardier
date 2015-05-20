/*global define */
define('models/marker', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkerModel = Backbone.Model.extend({
        defaults: {
            "articleid" : 0,
            "view"      : null,
            "json"      : {},
            "selected"  : false
        },
        select: function() {
            this.trigger('select', this.get('articleid'));
        }
    });    
    return MarkerModel;
});
