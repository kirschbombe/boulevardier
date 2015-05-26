/*global define*/
define('views/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/map.html'
    , 'models/map'
    , 'views/marker'
], function($,_,Backbone,L,mapPartial,MapModel,MarkerView) {
    'use strict';
    var MapView = Backbone.View.extend({
        id:      'map',
        tagName: 'div',
        initialize: function(args) {
            var that = this;
            that.config = args.config;
            that.model = new MapModel(args);
            that.router = args.router;
        }
        , render: function () {
            var that = this;
            if ($('#' + that.id).children().length > 0) return;
            // put div#map in place
            // note: map.json has the @id value: {"id" : "map"}
            $('body').append(mapPartial);
            // Leaflet config
            this.model.init().done(function() {
                var col       = that.model.get('collection');
                var mapconfig = that.model.get('mapconfig');
                var map       = new L.Map(mapconfig.id, mapconfig.map);
                var openpopup = {};
                var popupid = function(latlng) {
                    return latlng.lat.toString()
                         + latlng.lng.toString()
                };
                that.configureMap(map,mapconfig,openpopup,popupid);
                // let map render while markers are added
                map.invalidateSize();
                window.setTimeout(function() {
                    col.forEach(function(markerModel) {
                        that.addMarkerToMap(markerModel,map,openpopup,popupid,mapconfig);
                    })
                }, that.config.map.markerDelay);
            });
        }
        , configureMap : function(map,mapconfig,openpopup,popupid) {
            var that        = this;
            var tilelayer   = new L.TileLayer(mapconfig.tileLayer.url, mapconfig.tileLayer.opts);
            var scale       = L.control.scale(mapconfig.scale);
            map.setView(new L.LatLng(mapconfig.view.lat, mapconfig.view.lng), mapconfig.view.zoom);
            map.addLayer(tilelayer);
            scale.addTo(map);
            // track the currently open popup
            map.on('popupopen', function(evt) {
                // event latency between leaflet and backbone
                // appears to cause popups to collapse erratically
                // in Firefox when clicking map pins
                if (navigator.userAgent.indexOf('Firefox') != -1) {
                    openpopup[popupid(evt.popup.getLatLng())] = true;
                } else {
                    openpopup[popupid(evt.popup.getLatLng())] = true;
                }
            });
            map.on('popupclose', function(evt){
                if (navigator.userAgent.indexOf('Firefox') != -1) {
                    openpopup[popupid(evt.popup.getLatLng())] = false;
                } else {
                    openpopup[popupid(evt.popup.getLatLng())] = false;
                }
            });
        }
        , addMarkerToMap: function(markerModel,map,openpopup,popupid,mapconfig) {
            var that        = this;
            var geojson     = markerModel.get('json');
            var markerView  = new MarkerView({model: markerModel, router: that.router});
            markerView.render();
            L.geoJson(geojson, {
                // feature is the geojson, a raw JS object
                // mapMarker is
                onEachFeature: function (feature, mapMarker) {
                    // add the popup to this marker
                    var popup = L.popup(mapconfig.features.popup);
                    popup.setContent(markerView.el);
                    mapMarker.bindPopup(popup);
                    // override the default click handler for the
                    // marker, which would close the popup if it
                    // were already open
                    mapMarker.removeEventListener('click');
                    mapMarker.on('click', function() {
                        markerModel.trigger('active');
                    });
                    mapMarker.on('mouseover', function(){
                        if (!that.config.map.hoverPopup) return;
                        if (openpopup[popupid(mapMarker.getLatLng())]) return;
                        mapMarker.openPopup();
                    });
                    // application object, not leafletjs
                    markerModel.on('active', function(artid) {
                        if (openpopup[popupid(mapMarker.getLatLng())]) return;
                        mapMarker.openPopup();
                    });
                    openpopup[popupid(mapMarker.getLatLng())] = false;
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon:           L.icon(mapconfig.features.icon),
                        clickable:      !!feature.properties.text,
                        title:          (feature.properties.markername || ''),
                        opacity:        mapconfig.features.opacity,
                        riseOnHover:    mapconfig.features.riseOnHover
                    });
                }
            }).addTo(map);
        }
    });
    return MapView;
});
