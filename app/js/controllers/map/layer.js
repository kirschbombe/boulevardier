/*global define*/
define('controllers/map/layer', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'controllers/map/layer/placetype'
    , 'controllers/map/layer/timeline'
], function($,_,Backbone,Controller,PlaceTypeController,TimelineController) {
    'use strict';
    var MapLayerController = Controller.extend({
          view   : null
        , router : null
        , map    : null
        , controlsconfig : null
        , initialize: function(args) {
            var that = this;
            that.map = args.map;
            that.view = args.view;
            that.model = args.model;
            that.controlsconfig = args.controlsconfig;
            that.subControllers = [];
            if (_.has(that.controlsconfig, 'placetype') && that.controlsconfig.placetype.enable) {
                that.subControllers.push(new PlaceTypeController({
                      views : that.view.markerViews
                    , map   : that.view.map
                    , mapconfig: that.model.attributes.mapconfig
                }));
            }
            if (_.has(that.controlsconfig, 'timeline') && that.controlsconfig.timeline.enable) {
                that.subControllers.push(new TimelineController({
                      markerViews : that.view.markerViews
                    , map         : that.view.map
                    , siteconfig  : that.model.attributes.config
                }));
            }
            _.forEach(that.subControllers, function(subController) {
                that.listenTo(subController, 'filter', function() {
                    that._updateMarkers()
                });
            });
        }
        // filter the visible map markers based on the placetype and the
        // timeline layer controls; the "hide" state takes precedence if
        // the controls disagree (i.e., a marker that is hidden on any
        // control is hidden on the map)
        , _updateMarkers: function() {
            var that = this;
            var show = [], hide = [];
            _.forEach(that.subControllers, function(subController){
                var res = subController.getFilterState();
                hide.push(res.hide)
                hide = _.flatten(hide);
            });
            _.forEach(that.view.markerViews, function(markerView) {
                var found = _.find(hide, function(hiddenLayer) {
                    hiddenLayer === markerView.markerLayer
                });
                if (!found)
                    show.push(markerView.markerLayer);
            });
            _.forEach(show, function(markerLayer) {
                that.view.map.addLayer(markerLayer);
            });
            _.forEach(hide, function(markerLayer) {
                that.view.map.removeLayer(markerLayer);
            });
        }
    });
    return MapLayerController;
});
