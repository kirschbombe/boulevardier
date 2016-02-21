/*global define*/
define('controllers/map/pan', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'mixins/domwatcher'
], function($,_,Backbone,Controller,DOMWatcher) {
    'use strict';
    var MapPanController = Controller.extend({
          map: null
        , mapconfig: null
        , initialize: function(args) {
            this.map = args.map;
            this.mapconfig = args.mapconfig;
            if (!this.map)
                throw new Error("Uninitialized map");
        }
        , _fitMarkerBounds : function(markerViews) {
            var that = this;
            var elt = document.getElementById('article');
            if (!elt) return;
            var edgePtX = L.DomUtil.getViewportOffset(elt).x;
            var bounds = L.latLngBounds(_.map(markerViews,function(markerView) {
                var lngLat = markerView.model.getGeojson().geometry.coordinates.slice(0);
                return L.latLng(lngLat.reverse());
            }));
            if (edgePtX === 0) {
                that.map.fitBounds(bounds);
            } else if (edgePtX != that.map.getSize().x) {
                // map underneath article
                that.map.fitBounds(bounds, {
                    'paddingBottomRight' : [document.body.clientWidth - edgePtX,0]
                });
            } else {
                // map beside article
                that.map.fitBounds(bounds);
            }
            that.map.invalidateSize();
        }
        // adjust map pan/zoom to make all map markers occur to the
        // left of div#article in wide mode
        , fitMarkerBounds : function(markerViews) {
            var that = this;
            var $def = $.Deferred();
            $def.then(function() {
                if (!that.mapconfig.view) {
                  that._fitMarkerBounds(markerViews);
                }
            });
            this.watchDOM(1000,'#article',$def);
        }
        , handlePopupPosition : function(popup) {
            var that = this;
            var map = that.map;
            var id = $(popup.getContent()).attr('id');
            var edgePtX, $popupWrap, popupLatLng, popupRightX, pad;
            popupLatLng = popup.getLatLng();
            if (popupLatLng === undefined) return;
            edgePtX = L.DomUtil.getViewportOffset(document.getElementById('article')).x;
            // map should pan right/east if the popup balloon is covered by the article;
            // pad is a slight relief between the popup and the article
            $popupWrap = $('#' + id).closest('.leaflet-popup-content-wrapper').first();
            pad = L.point(popup.options.autoPanPaddingBottomRight || popup.options.autoPanPadding);
            pad = pad ? pad.x : 0;
            popupRightX = ($popupWrap.length > 0)
                ? $popupWrap.offset().left + $popupWrap.width() + pad
                : 0;
            if (edgePtX != 0 && popupRightX > edgePtX && edgePtX != map.getSize().x) {
                map.panBy([popupRightX - edgePtX,0]);
            } else if (!map.getBounds().contains(popup.getLatLng())) {
                map.closePopup(popup);
                map.openPopup(popup);
            }
        }
    });
    _.extend(MapPanController.prototype,DOMWatcher);
    return MapPanController;
});
