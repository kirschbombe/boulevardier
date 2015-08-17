/*global define*/
define('controllers/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'models/map'
    , 'views/map'
    , 'mixins/asyncInit'    
], function($,_,Backbone,Controller,MapModel,MapView,AsyncInit) {
    'use strict';
    var MapController = Controller.extend({
          model: null
        , view:  null
        , issue: null
        , initialize: function(args) {
            var that = this;
            that.$def = $.Deferred();
            that.router = args.router;
            that.issue = args.issue;
            that.model = new MapModel(args);
            that.view = new MapView({
                  model:  that.model
                , router: that.router
                , issue: that.issue
            });
            that.view.init().done(function() {
                that.listenTo(that.view, 'markers', function(markerViews){
                    that._registerMarkers(markerViews);
                });
                that.view.render();
                that.$def.resolve(that);
            });
        }
        , _registerMarkers : function(markerViews) {
            var that = this;
            _.forEach(markerViews, function(markerView) {
                that.listenTo(markerView.model, 'active', function(article) {
                    that.mapPopupOpen(markerView.markerLayer);
                });
                that.listenTo(markerView.model, 'toggle', function(article) {
                    that.mapPopupToggle(markerView.markerLayer);
                });
                that.listenTo(markerView, 'click', function(evt) {
                    that.mapPopupOpen(evt);
                    markerView.model.trigger('active', markerView.model);
                });
                that.listenTo(markerView,'mouseover', function(evt) {
                    if (!that.view.map.hoverPopup) return;
                    if (openpopup[popupid(mapMarker.getLatLng())]) return;
                    mapMarker.openPopup();
                });
            });
        }
        , _getMarkerLayer : function(obj) {
            var mapMarkerLayer;
            if (obj instanceof L.LayerGroup) {
                mapMarkerLayer = obj;
            } else if (_.has(obj, 'originalEvent')) {
                mapMarkerLayer = obj.target;
            }
            return mapMarkerLayer;
        }
        , mapPopupOpen: function(obj) {
            var mapMarkerLayer = this._getMarkerLayer(obj);
            // event latency between leaflet and backbone appears to cause popups to collapse
            // erratically in Firefox when clicking map pins
            if (navigator.userAgent.indexOf('Firefox') != -1) {
                mapMarkerLayer.openPopup();
            } else {
                mapMarkerLayer.openPopup();
            }
        }
        , mapPopupToggle: function(obj) {
            var mapMarkerLayer = this._getMarkerLayer(obj);
            if (navigator.userAgent.indexOf('Firefox') != -1) {
                mapMarkerLayer.togglePopup();
            } else {
                mapMarkerLayer.togglePopup();
            }
        }
    });
    _.extend(MapController.prototype,AsyncInit);
    return MapController;
});
