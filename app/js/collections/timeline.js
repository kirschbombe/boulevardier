/*global define */
define('collections/timeline', [
    'jquery', 
    'underscore', 
    'backbone',
    'models/map/layer/timeline/item'
], function($,_,Backbone,TimelineItemModel) {
    'use strict';
    var TimelineCollection = Backbone.Collection.extend({
        model: TimelineItemModel
    });    
    return TimelineCollection;
});
