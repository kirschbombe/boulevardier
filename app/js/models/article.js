/*global define */
define('models/article', [
    'jquery',
    'underscore',
    'backbone',
    'views/article',
    'mixins/fetchxml',
    'mixins/asyncInit',
    'views/article/menu'
], function($,_,Backbone,ArticleView,FetchXML,AsyncInit,ArticleMenuView) {
    'use strict';
    var ArticleModel = Backbone.Model.extend({
        initialize: function() {
            var that = this;
            that.$def = $.Deferred();
            var $get = that.fetchXML(that, that.get('path'));
            $.when($get).done(function(data) {
                that.set('xml', data);
                that.$def.resolve(that);
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.log("Failed to retrieve article (" + that.get('id') + "), : " + errorThrown);
                that.$def.fail();
            });
        },
        defaults: {
            //TODO: 'xml': serialize? and cache to localstorage
            // add adapter for access through .attributes
            "xml"   : null,     // Document
            "marker" : null     // associated mapmarker object, needed for TOC linkage
        },
        select: function() {
            this.trigger('active');
        },
        unselect: function() {
            this.trigger('inactive');
        }
    });
    _.extend(ArticleModel.prototype,FetchXML);
    _.extend(ArticleModel.prototype,AsyncInit);
    return ArticleModel;
});
