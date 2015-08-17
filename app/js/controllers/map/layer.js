/*global define*/
define('controllers/map/layer', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MapLayerController = _.extend({}, Backbone.Events);
    _.extend(MapLayerController, {
          model  : null
        , views  : null
        , router : null
        , initialize: function(args) {
            debugger;
            // do per-marker map configuration
            col.forEach(function(markerModel) {
                var geojson = (markerModel.get('json') || {"properties":{}});
                var layer = geojson.properties.layer;
                var iconConfig = mapconfig.features.icon;
                iconConfig.iconUrl = (markerModel.get('iconUrl') || '');
                var icon = L.icon(iconConfig);
                that.addMarkerToLayer(markerModel,map,openpopup,popupid,mapconfig,layerMarkers,icon,iconConfig.iconUrl);
            });
            // add marker layers
            _.each(_.keys(layerMarkers), function(layerName) {
                var klass = layerName.replace(/\s+/g, '-');
                var layerLegend = legendTempl({
                      iconUrl: that.model.get('iconUrls')[layerName]
                    , title  : layerName
                    , klass  : klass
                });
                layerGroups[layerLegend] = L.layerGroup(layerMarkers[layerName]);
            });
            that.addLayerControl(layerGroups,mapconfig.control.layers.options,map);
            // add mapmarker to layer by layer type
            if (_.has(layerMarkers, geojson.properties.layer)) {
                layerMarkers[geojson.properties.layer].push(mapMarker);
            } else {
                layerMarkers[geojson.properties.layer] = [mapMarker];
            }
        }
        , addView: function(view) {
            this.views.push(view);
        }
        , addLayerControl : function (layerGroups,options,map) {
            L.control.layers(null, layerGroups, options).addTo(map);
            $('input.leaflet-control-layers-selector').each(function(i,elt) {
               $(elt).click();
            });
        }
    });
    return MapLayerController;
});
