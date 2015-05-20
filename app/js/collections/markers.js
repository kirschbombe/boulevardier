/*global define */
define('collections/markers', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkersCollection = Backbone.Collection.extend({
        model: 'Marker',
        app: null,
        init: null,
        initialize: function(args,props) {
            var that = this;
            that.app = props.app;
            that.init = props.init;
            that.on('complete', function() {
                that.init.resolve(that);
            });
        }
    });    
    return MarkersCollection;
});
