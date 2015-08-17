/*global define*/
define('controllers/map/layer', [
    'jquery',
    'underscore',
    'backbone'
], function($,_,Backbone) {
    'use strict';
    var MapPanController = Backbone.Events.extend({
          models: []
        , views:  []
        , initialize: function(args) {
            debugger;
        }
        , a : function(){
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
        }
        , handlePopupPosition : function(map,popup) {
            var edgePtX, $popupWrap, popupLatLng, popupRightX, pad;
            popupLatLng = popup.getLatLng();
            if (popupLatLng === undefined) return;
            edgePtX = L.DomUtil.getViewportOffset(document.getElementById('article')).x;
            // map should pan right/east if the popup balloon is covered by the article;
            // pad is a slight relief between the popup and the article
            $popupWrap = $(popup.getContent()).closest('.leaflet-popup-content-wrapper').first();
            pad = L.point(popup.options.autoPanPaddingBottomRight || popup.options.autoPanPadding);
            pad = pad ? pad.x : 0;
            popupRightX = $popupWrap.offset().left + $popupWrap.width() + pad;
            if (edgePtX != 0 && popupRightX > edgePtX && edgePtX != map.getSize().x) {
                map.panBy([popupRightX - edgePtX,0]);
            } else if (!map.getBounds().contains(popup.getLatLng())) {
                map.closePopup(popup);
                map.openPopup(popup);
            }
        }
    });
    return MapPanController;
});
