/*global define */
define('collections/markers', [
    'jquery', 
    'underscore',
    'backbone',
    'models/marker'
], function($,_,Backbone,MarkerModel) {
    'use strict';
    var MarkersCollection = Backbone.Collection.extend({
        model: MarkerModel
    });    
    return MarkersCollection;
});
