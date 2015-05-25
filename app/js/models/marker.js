/*global define */
define('models/marker', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkerModel = Backbone.Model.extend({
        defaults: {
            "articleModel"  : null,
            "view"          : null,
            "json"          : {}
        },
        initialize: function(args) {
            var that = this;
            that.app = args.app;
            that.articleModel = args.articleModel;
            args.issue.init().done(function(issue) {
                that.on('active', function() {
                    issue.trigger('select', that.get('articleModel'));
                });
                that.articleModel.on('active', function(){
                    that.trigger('active')
                });
            });
        }
    });    
    return MarkerModel;
});
