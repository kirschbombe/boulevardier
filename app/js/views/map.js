/*global define*/
define('views/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/map.html'
    , 'models/map'
    , 'views/marker'
    , 'mixins/asyncInit'
], function($,_,Backbone,L,mapPartial,MapModel,MarkerView,AsyncInit) {
    'use strict';
    var MapView = Backbone.View.extend({
        id:      'map',
        tagName: 'div',
        initialize: function(args) {
            var that = this;
            that.$def = $.Deferred();
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
                that.configureMap(map,mapconfig,openpopup,popupid,col.models);
                col.forEach(function(markerModel) {
                    that.addMarkerToMap(markerModel,map,openpopup,popupid,mapconfig);
                });
                that.$def.resolve(that);
            });
        }
        , configureMap : function(map,mapconfig,openpopup,popupid,markers) {
            var that, tilelayer, scale, bounds, edgePtX;
            that = this;
            tilelayer = new L.TileLayer(mapconfig.tileLayer.url, mapconfig.tileLayer.opts);
            scale = L.control.scale(mapconfig.scale);
            map.addLayer(tilelayer);
            scale.addTo(map);
            edgePtX = L.DomUtil.getViewportOffset(document.getElementById('article')).x;
            bounds = L.latLngBounds(_.map(markers,function(marker) {
                var lngLat = marker.get('json').geometry.coordinates.slice(0);
                return L.latLng(lngLat.reverse());
            }));
            if (edgePtX != map.getSize().x) {
                // map underneath article
                map.fitBounds(bounds, {
                    'paddingBottomRight' : [document.body.clientWidth - edgePtX,0]
                });
            } else {
                // map beside article
                map.fitBounds(bounds);
            }
            map.invalidateSize();
            // track the currently open popup
            map.on('popupopen', function(evt) {
                var popup, $popupWrap, popupLatLng, popupRightX, pad;
                popup = evt.popup;
                popupLatLng = popup.getLatLng();
                // map should pan right/east if the popup balloon is covered by the article;
                // pad is a slight relief between the popup and the article
                $popupWrap = $(popup.getContent()).closest('.leaflet-popup-content-wrapper').first();
                pad = L.point(popup.options.autoPanPaddingBottomRight || popup.options.autoPanPadding);
                pad = pad ? pad.x : 0;
                popupRightX = $popupWrap.offset().left + $popupWrap.width() + pad;
                if (popupRightX > edgePtX && edgePtX != map.getSize().x) map.panBy([popupRightX - edgePtX,0]);
                // event latency between leaflet and backbone appears to cause popups to collapse
                // erratically in Firefox when clicking map pins
                if (navigator.userAgent.indexOf('Firefox') != -1) {
                    openpopup[popupid(popupLatLng)] = true;
                } else {
                    openpopup[popupid(popupLatLng)] = true;
                }
            });
            map.on('popupclose', function(evt) {
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
    _.extend(MapView.prototype,AsyncInit);
    return MapView;
});
