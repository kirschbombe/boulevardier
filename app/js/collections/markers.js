/*global define */
define('collections/markers', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkersCollection = Backbone.Collection.extend({
        init: null,
        initialize: function(args) {
            var that = this;
            that.init = args.init;
            that.on('complete', function() {
                that.init.resolve(that);
            });
        }
    });    
    return MarkersCollection;
});
