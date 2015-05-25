/*global define */
define('models/marker', [
    'jquery', 
    'underscore', 
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkerModel = Backbone.Model.extend({
        app: null,
        defaults: {
            "articleModel" : null,
            "view"      : null,
            "json"      : {}
        },
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.articleModel = opts.articleModel;
            that.app.fetch('models/issue').done(function(issue) {
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
