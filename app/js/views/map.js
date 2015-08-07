/*global define*/
define('views/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/map.html'
    , 'text!partials/marker-legend.html'
    , 'models/map'
    , 'views/marker'
    , 'mixins/asyncInit'
], function($,_,Backbone,L,mapPartial,legendPartial,MapModel,MarkerView,AsyncInit) {
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
                var icconfig  = that.config.markers.icons;
                var mapconfig = that.model.get('mapconfig');
                var map       = new L.Map(mapconfig.id, mapconfig.map);
                var legendTempl = _.template(legendPartial);
                var openpopup = {};
                var layerMarkers = {};
                var layerGroups = {};
                var layerIcons = {};
                var iconFiles = _.shuffle(_.flatten(
                    _.map(icconfig, function(entry) {
                        return _.map(entry.files, function(file) {
                            return entry.dir.concat(file);
                        });
                    })
                ));
                var popupid = function(latlng) {
                    return latlng.lat.toString()
                         + latlng.lng.toString()
                };
                that.configureMap(map,mapconfig,openpopup,popupid,col.models);
                // marker color setup
                col.forEach(function(markerModel) {
                    var geojson = (markerModel.get('json') || {"properties":{}});
                    var layer = geojson.properties.layer;
                    layerMarkers[layer] = [];
                    layerIcons[layer] = layerIcons[layer] || iconFiles.pop();
                });
                // do per-marker map configuration
                col.forEach(function(markerModel) {
                    var geojson = (markerModel.get('json') || {"properties":{}});
                    var layer = geojson.properties.layer;
                    var iconConfig = mapconfig.features.icon;
                    var iconUrl = layerIcons[layer];
                    iconConfig['iconUrl'] = iconUrl;
                    var icon = L.icon(iconConfig);
                    that.addMarkerToLayer(markerModel,map,openpopup,popupid,mapconfig,layerMarkers,icon,iconUrl);
                });
                // add marker layers
                _.each(_.keys(layerMarkers), function(layerName){
                    var layerLegend = legendTempl({
                          iconUrl: layerIcons[layerName]
                        , title: layerName
                    });
                    layerGroups[layerLegend] = L.layerGroup(layerMarkers[layerName]);
                });
                L.control.layers(null, layerGroups, mapconfig.control.layers.options).addTo(map);
                // enable each layer; TODO: determine if this is configurable
                $('input.leaflet-control-layers-selector').each(function(i,elt){
                   $(elt).click();
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
            if (edgePtX === 0) {
                map.fitBounds(bounds);
            } else if (edgePtX != map.getSize().x) {
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
                if (edgePtX != 0 && popupRightX > edgePtX && edgePtX != map.getSize().x)
                    map.panBy([popupRightX - edgePtX,0]);
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
        , addMarkerToLayer: function(markerModel,map,openpopup,popupid,mapconfig,layerMarkers,icon,iconUrl) {
            var that        = this;
            var geojson     = markerModel.get('json');
            var markerView  = new MarkerView({
                  model     : markerModel
                , router    : that.router
                , iconUrl   : iconUrl
                , iconTitle : geojson.properties.layer
            });
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
                    // add mapmarker to layer by layer type
                    layerMarkers[geojson.properties.layer].push(mapMarker);
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon:        icon,
                        clickable:   !!feature.properties.text,
                        title:       (feature.properties.markername || ''),
                        opacity:     mapconfig.features.opacity,
                        riseOnHover: mapconfig.features.riseOnHover
                    });
                }
            });
        }
    });
    _.extend(MapView.prototype,AsyncInit);
    return MapView;
});
