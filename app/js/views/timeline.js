/*global define*/
define('views/timeline', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/timeline.html'
    , 'controls/L.Control.Timeline'
], function($,_,Backbone,L,timelineControlPartial) {
    'use strict';
    var TimelineView = Backbone.View.extend({
          id: 'timeline'
        , map: null
        , initialize: function(args) {
            var that = this;
            that.map = args.map;
        }
        , render: function() {
            var that = this;
            $('.leaflet-top.leaflet-left').append(timelineControlPartial);            
            that.model.init().done(function() {
                that.timeline = L.control.timeline({
                    on: { brushend: function(a) { that.handleFilter(a); }}
                });
                that.timeline.addData(that.model);
            });
        }
        , handleFilter : function(selected) {
            this.trigger('filter', selected);
        }
    });
    return TimelineView;
});

