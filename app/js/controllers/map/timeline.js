/*global define*/
define('controllers/map/timeline', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'views/timeline'
    , 'models/timeline'
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
            _.forEach(args.markerViews, function(markerView){
                that.listenTo(markerView.model, 'show', function() {
                    debugger;
                });
                that.listenTo(markerView.model, 'hide', function() {
                    debugger;
                });
            });
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
            that.listenTo(that.view, 'filter', function(results) {
                var showModels, hideModels, showIds = {};
                if (results.clear) {
                    showModels = _.map(that.markerViews, function(markerView) {
                        return markerView.model;
                    });
                    this.trigger('show', showModels);
                } else {
                    showModels = _.map(results.selected, function(item) {
                        var article = item.markerView.model;
                        showIds[article.cid] = undefined;
                        return article;
                    });
                    hideModels = _.filter(that.markerViews, function(markerView) {
                        return !(markerView.model.cid in showIds);
                    });
                    this.trigger('hide', hideModels)
                    //this.trigger('show', showModels);
                }
            });
            that.view.render();
        }
    });
    return MapTimelineController;
});
