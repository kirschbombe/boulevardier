/*global define */
define('collections/articles', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var ArticlesCollection = Backbone.Collection.extend({
        model: 'Article',
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
    return ArticlesCollection;
});
