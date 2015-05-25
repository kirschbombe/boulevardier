/*global define*/
define('views/article/geojson', [
    'jquery', 
    'underscore', 
    'backbone',
    'mixins/xml2html',
    'text!xsl/geojson.xsl'
], function($,_,Backbone,XML2HTML,geoJsonXsl) {
    'use strict';
    var GeoJsonView = Backbone.View.extend({
        render: function(router) {
            var that = this;
            var xslDoc = new DOMParser().parseFromString(geoJsonXsl,'text/xml');
            // this view is meant to be called only after the corresponding
            // article model has been initialized
            if (this.model.init.state() !== 'resolved') {
                throw "Uninitialized article in GeoJsonView";
            }
            var geojson;
            try {
                geojson = JSON.parse(that.xml2html(that.model.get('xml'), xslDoc, {}, 'text'));
            } catch (e) {
                console.log('Failed to parse to json: ' + e.toString());
                throw "Failed to parse to json: " + e.toString();
            }
            return geojson;
        }
    });
    _.extend(GeoJsonView.prototype,XML2HTML);
    return GeoJsonView;
});
