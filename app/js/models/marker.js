/*global define */
define('models/marker', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MarkerModel = Backbone.Model.extend({
        "article"   : null,
        "json"      : {},
        initialize: function(args) {
            var that = this;
            that.app = args.app;
            that.article = args.article;
            that.router = args.router;
            args.issue.init().done(function(issue) {
                // when an article is made active (e.g., through the
                // TOC), propogate through to the map part of the app
                that.listenTo(that.article, 'active', function() {
                    that.trigger('active')
                });
            });
        }
    });
    return MarkerModel;
});
