/*global define */
define('models/article', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'mixins/fetchxml'
    , 'mixins/asyncInit'
    , 'mixins/xml2html'
    , 'text!xsl/geojson.xsl'
], function($,_,Backbone,FetchXML,AsyncInit,XML2HTML,geoJsonXsl) {
    'use strict';
    var ArticleModel = Backbone.Model.extend({
        initialize: function() {
            var that = this;
            that.$def = $.Deferred();
            var $get = that.fetchXML(that.get('path'));
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
        },
        geojson: function() {
            var geojson = '{}';
            try {
                var xml = this.get('xml');
                var jsonString = this.xml2html(xml, geoJsonXsl, {}, 'text');
                geojson = JSON.parse(jsonString);
            } catch (e) {
                throw new Error("Failed to parse to json: " + e.toString());
            }
            return geojson;
        }
    });
    _.extend(ArticleModel.prototype,FetchXML);
    _.extend(ArticleModel.prototype,AsyncInit);
    _.extend(ArticleModel.prototype,XML2HTML);
    return ArticleModel;
});
