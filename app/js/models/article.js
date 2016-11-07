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
    , 'models/error/user'
    , 'views/error/user'
], function($,_,Backbone,FetchXML,AsyncInit,XML2HTML,geoJsonXsl,citedRangeXsl,UserErrorModel,UserErrorView) {
    'use strict';
    var ArticleModel = Backbone.Model.extend({
        initialize: function() {
            var that = this;
            that.$def = $.Deferred();
            try {
                var $get = that.fetchXML(that.get('path'));
                $.when($get).done(function(data) {
                    that.set('xml', data);
                    that._mkGeojson();
                    that._mkCitedRange();
                    if (that.geojson) {
                        that.set('placeType', that.geojson.properties.layer);
                        that.$def.resolve(that);
                    } else {
                        that.$def.reject();
                    }
                }).fail(function(textStatus) {
                    new UserErrorView({
                        model: new UserErrorModel({
                            msg: "Error encountered handling xml file at '" + that.get('path') + "': " + textStatus
                        })
                    })
                    that.$def.reject();
                });
            } catch (e) {
                that.$def.reject();
                new UserErrorView({
                    model: new UserErrorModel({
                        msg: e.toString()
                    })
                })
            }
        },
        defaults: {
            //TODO: add adapter for access through model attributes
            // so that model isn't tied to encoding
              "xml"       : null    // Document
            , "placeType" : null
            , "iconUrl"   : ''
            , "citedRange": {}
        },
        geojson: null,
        getGeojson: function() {
            if (this.geojson === null)
                this._mkGeojson();
            return this.geojson;
        },
        _mkGeojson: function() {
            var that = this;
            try {
                var jsonString = this.xml2html(this.get('xml'), geoJsonXsl, {}, 'text');
                this.geojson = JSON.parse(jsonString);
            } catch (e) {
                new UserErrorView({
                    model: new UserErrorModel({
                        msg: "Failed to parse geojson generated from '" +
                        that.get('path') + "': " + e.toString()
                    })
                })
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
