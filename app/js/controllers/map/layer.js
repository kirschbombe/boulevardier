/*global define*/
define('controllers/map/layer', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'text!partials/marker-legend.html'
], function($,_,Backbone,Controller,legendPartial) {
    'use strict';
    var MapLayerController = Controller.extend({
          views  : null
        , router : null
        , map    : null
        , initialize: function(args) {
            var that = this;
            that.views = args.views;
            that.map = args.map;
            that.mapconfig = args.mapconfig;            
            var legendTempl = _.template(legendPartial);
            var layerMarkers = _.groupBy(that.views, function(markerView){
                return markerView.model.getGeojson().properties.layer;
            });
            var control = L.control.layers(null, null, that.mapconfig.control.layers.options).addTo(that.map);            
            _.each(_.keys(layerMarkers), function(layerName) {
                var klass = layerName.replace(/\s+/g, '-');
                var layerLegend = legendTempl({
                      iconUrl: layerMarkers[layerName][0].model.get('iconUrl')
                    , title  : layerName
                    , klass  : klass
                });
                var markerLayers = _.map(layerMarkers[layerName], function(view){ return view.markerLayer; });
                var layer = L.layerGroup(markerLayers);
                control.addOverlay(layer,layerLegend);
            });
            $('input.leaflet-control-layers-selector').each(function(i,elt) {
               $(elt).click();
            });
        }
    });
    return MapLayerController;
});
