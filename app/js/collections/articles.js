/*global define */
define('collections/articles', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var ArticlesCollection = Backbone.Collection.extend({
        init: null,
        initialize: function(args) {
            var that = this;
            that.init = args.init;
            that.on('complete', function() {
                that.init.resolve(that);
            });
        }
    });    
    return ArticlesCollection;
});
