/*global define*/
define('views/map', [
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    'text!partials/map.html'
], function($,_,Backbone,L,mapPartial) {
    'use strict';
    var MapView = Backbone.View.extend({
        id: 'map',
        tagName: 'div',
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            this.app.fetch('models/map').then(function(mapModel) {
                that.model = mapModel;
                that.listenToOnce(mapModel,'change',that.render);
                that.init.resolve(that);
            }).fail(function(a) {
                console.log('Failed to init map view.');
            });
        },
        render: function () {
            var that = this;
            // put div#map in place
            // note: map.json has the @id value: {"id" : "map"}
            if ($('#' + this.id).children().length > 0) return;
            $('body').append(mapPartial);
            // Leaflet config
            var col = this.model.get('collection');
            var config = this.model.get('mapconfig');
            var map = new L.Map(config.id, config.map);
            var tilelayer = new L.TileLayer(config.tileLayer.url, config.tileLayer.opts);
            map.setView(new L.LatLng(config.view.lat, config.view.lng), config.view.zoom);
            map.addLayer(tilelayer);
            var scale = L.control.scale(config.scale);
            scale.addTo(map);
            var openpopup = {};
            var popupid = function(latlng) {
                return latlng.lat.toString()
                     + latlng.lng.toString()
            };
            // render map immediately, then add markers to improve load
            map.invalidateSize();
            var addMarkers = function() {
                // add each marker and configure
                col.forEach(function(markerModel) {
                    var geojson = markerModel.get('json');
                    var markerView = markerModel.get('view');
                    L.geoJson(geojson, {
                        // feature is the geojson, a raw JS object
                        // mapMarker is
                        onEachFeature: function (feature, mapMarker) {
                            // add the popup to this marker
                            var popup = L.popup(config.features.popup);
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
                                if (!that.app.config.map.hoverPopup) return;
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
                                icon:           L.icon(config.features.icon),
                                clickable:      !!feature.properties.text,
                                title:          (feature.properties.markername || ''),
                                opacity:        config.features.opacity,
                                riseOnHover:    config.features.riseOnHover
                            });
                        }
                    }).addTo(map);
                });
                // keep track of which popup is currently open, since
                // the popupopen/popupclose events do not fire for
                // individual popups
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
                //map.invalidateSize();
            }
            window.setTimeout(addMarkers, that.app.config.map.markerDelay);
        }
    });
    return MapView;
});
