/*global define */
define('models/article', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'mixins/fetchxml'
    , 'mixins/asyncInit'
    , 'mixins/xml2html'
    , 'text!xsl/geojson.xsl'
    , 'text!xsl/cited-range.xsl'
], function($,_,Backbone,FetchXML,AsyncInit,XML2HTML,geoJsonXsl,citedRangeXsl) {
    'use strict';
    var ArticleModel = Backbone.Model.extend({
        initialize: function() {
            var that = this;
            that.$def = $.Deferred();
            var $get = that.fetchXML(that.get('path'));
            $.when($get).done(function(data) {
                that.set('xml', data);
                that._mkGeojson();
                that._mkCitedRange();
                if (that.geojson !== null)
                    that.set('placeType', that.geojson.properties.layer);
                that.$def.resolve(that);
            }).fail(function() {
                that.$def.reject();
            });
        },
        defaults: {
            //TODO: 'xml': serialize? and cache to localstorage
            // add adapter for access through .attributes
              "xml"       : null    // Document
            , "placeType" : null
            , "iconUrl"   : ''
            , "citedRange": {}
        },
        select: function() {
            this.trigger('active');
        },
        unselect: function() {
            this.trigger('inactive');
        },
        toggle: function() {
            this.trigger('toggle');
        },
        geojson: null,
        getGeojson: function() {
            if (this.geojson === null)
                this._mkGeojson();
            return this.geojson;
        },
        _mkGeojson: function() {
            try {
                var jsonString = this.xml2html(this.get('xml'), geoJsonXsl, {}, 'text');
                this.geojson = JSON.parse(jsonString);
            } catch (e) {
                throw new Error("Failed to parse geojson: " + e.toString());
            }
        },
        _mkCitedRange: function() {
            try {
                var jsonString = this.xml2html(this.get('xml'), citedRangeXsl, {}, 'text');
                this.set('citedRange', JSON.parse(jsonString));
            } catch (e) {
                throw new Error("Failed to parse cited range json: " + e.toString());
            }
        }
    });
    _.extend(ArticleModel.prototype,FetchXML);
    _.extend(ArticleModel.prototype,AsyncInit);
    _.extend(ArticleModel.prototype,XML2HTML);
    return ArticleModel;
});
