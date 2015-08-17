/*global define*/
define('controllers/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'models/map'
    , 'views/map'
    , 'mixins/asyncInit'
    , 'controllers/map/pan'
    , 'controllers/map/layer'
], function($,_,Backbone,Controller,MapModel,MapView,AsyncInit,MapPanController,MapLayerController) {
    'use strict';
    var MapController = Controller.extend({
          model: null
        , view:  null
        , issue: null
        , mapPanController : null
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
            that.model.init().done(function() {
            });
            that.view.init().done(function() {
                that.mapPanController = new MapPanController({
                    map: that.view.map
                });
                that.mapLayerController = new MapLayerController({
                      views : that.view.markerViews
                    , map   : that.view.map
                    , mapconfig: that.model.attributes.mapconfig
                });                
                that.listenTo(that.view, 'markers', function(markerViews){
                    that._registerMarkers(markerViews);
                    that.mapPanController.fitMarkerBounds(that.view.markerViews);
                });
                that.view.render();
            });
            $.when.apply(null,[that.model.init(), that.view.init()]).done(function() {
                that.$def.resolve(that);
            });
        }
        , _registerMarkers : function(markerViews) {
            var that = this;
            _.forEach(markerViews, function(markerView) {
                that.listenTo(markerView.model, 'active', function(article) {
                    that.mapPopupOpen(markerView.markerLayer);
                    var marker = that._getMarkerLayer(markerView.markerLayer, 'getPopup');
                    if (marker !== null)
                        that.mapPanController.handlePopupPosition(marker.getPopup());
                });
                that.listenTo(markerView.model, 'toggle', function(article) {
                    that.mapPopupToggle(markerView.markerLayer);
                    var marker = that._getMarkerLayer(markerView.markerLayer, 'getPopup');
                    if (marker !== null)
                        that.mapPanController.handlePopupPosition(marker.getPopup());
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
        , _getMarkerLayer : function(obj,method) {
            var mapMarkerLayer, layers;
            if (obj instanceof L.LayerGroup) {
                if (method in obj) {
                    mapMarkerLayer = obj;
                } else {
                    layers = obj.getLayers();
                    while (obj = layers.pop()) {
                        if (method in obj) {
                            mapMarkerLayer = obj;
                            break;
                        }
                    }
                }
            } else if (_.has(obj, 'originalEvent')) {
                mapMarkerLayer = obj.target;
            }
            return mapMarkerLayer;
        }
        , mapPopupOpen: function(obj) {
            var mapMarkerLayer = this._getMarkerLayer(obj, 'openPopup');
            if (!mapMarkerLayer) return;
            mapMarkerLayer.openPopup();
        }
        , mapPopupToggle: function(obj) {
            var mapMarkerLayer = this._getMarkerLayer(obj, 'togglePopup');
            if (!mapMarkerLayer) return;
            mapMarkerLayer.togglePopup();
        }
    });
    _.extend(MapController.prototype,AsyncInit);
    return MapController;
});
