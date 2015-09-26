/*global define*/
define('controllers/map/layer/timeline', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'views/map/layer/timeline'
    , 'models/map/layer/timeline'
], function($,_,Backbone,Controller,TimelineView,TimelineModel) {
    'use strict';
    var MapTimelineController = Controller.extend({
          map    : null
        , model  : null
        , view   : null
        , siteconfig: null
        , markerViews: null
        , initialize: function(args) {
            var that = this;
            that.views = args.views;
            that.map = args.map;
            that.markerViews = args.markerViews;
            that.model = new TimelineModel({
                  siteconfig  : args.siteconfig
                , markerViews : args.markerViews
            });
            that.view = new TimelineView({
                  model : that.model
                , map   : that.map
                , markerViews : args.markerViews
            });
            // results.clear is a flag that the brush is empty
            // results.incl is an array of MapTimelineItem's
            // trigger show/hide on lists of ArticleModel's
            that.listenTo(that.view, 'filter', that._handleFilterEvent);
            that.view.render();
        }
        , _handleFilterEvent : function(results) {
            var that = this;
            var showLayers = [], hideLayers = [], showIds = {};
            if (results.clear) {
                showLayers = _.map(that.markerViews, function(markerView) {
                    return markerView.markerLayer;
                });
            } else {
                showLayers = _.map(results.selected, function(item) {
                    showIds[item.markerView.model.cid] = undefined;
                    return item.markerView.markerLayer;
                });
                hideLayers = _.map(_.filter(that.markerViews, function(markerView) {
                    return !(markerView.model.cid in showIds);
                }), function(markerView) {
                    return markerView.markerLayer;
                });
            }
            that.show = showLayers;
            that.hide = hideLayers;
            that.trigger('filter');
        }
        , getFilterState : function() {
            return {
                  show: (this.show || [])
                , hide: (this.hide || [])
            };
        }
    });
    return MapTimelineController;
});
