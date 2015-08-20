/*global define*/
define('controllers/map/layer/placetype', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'text!partials/marker-legend.html'
], function($,_,Backbone,Controller,legendPartial) {
    'use strict';
    var PlacetypeController = Controller.extend({
          views  : null
        , router : null
        , map    : null
        , control : null
        , initialize: function(args) {
            var that = this;
            that.views = args.views;
            that.map = args.map;
            that.mapconfig = args.mapconfig;
            var legendTempl = _.template(legendPartial);
            var layerMarkers = _.groupBy(that.views, function(markerView){
                return markerView.model.getGeojson().properties.layer;
            });
            var control = that.control = L.control.layers(null, null, that.mapconfig.control.layers.options).addTo(that.map);
            // disable mouseover/mouseout events for this control, which are set by default in
            // Leaflet; enables 'click' control
            var container = control.getContainer();
            _.forEach(Object.keys(container), function(key){
                if (key.match('mouseover'))
                    container.removeEventListener('mouseover', container[key]);
                if (key.match('mouseout'))
                    container.removeEventListener('mouseout', container[key]);
            });
            // in Safari, layer control button does not receive 'focus' event on click
            
            L.DomEvent.on($('.leaflet-control-layers-toggle')[0], 'click', control._expand, control);
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
            control.mapLayerController = that;
            control._onInputClick = that._onInputClick;
        }
        , getFilterState : function() {
            return {
                  show: (this.show || [])
                , hide: (this.hide || [])
            };
        }
        // TODO: do not override this private method; safer to replace
        //  L.control.layers() with a custom control
        , _onInputClick: function() {
            var control = this;
            var show = [], hide = [];
    		var i, input, obj,
    		    inputs = control._form.getElementsByTagName('input'),
    		    inputsLen = inputs.length;
    		control._handlingClick = true;
    		for (i = 0; i < inputsLen; i++) {
    			input = inputs[i];
    			obj = control._layers[input.layerId];
    			if (input.checked) {
    				obj.layer.getLayers().forEach(function(layer) {
    				    show.push(layer);
    			    });
    			} else {
    				obj.layer.getLayers().forEach(function(layer) {
    				    hide.push(layer);
    			    });
    			}
    		}
    		control._handlingClick = false;
    		control._refocusOnMap();
    		control.mapLayerController.show = show;
    		control.mapLayerController.hide = hide;
    		control.mapLayerController.trigger('filter');
        }
    });
    return PlacetypeController;
});
