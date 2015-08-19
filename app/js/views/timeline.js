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
        , _timelineCollapse : function() {
            var that = this;
            that.handleFilter({clear:true});
            $('.leaflet-control-timeline')
                .removeClass('leaflet-control-timeline-expanded')
                .addClass('leaflet-control-timeline-collapsed');
        }
        , render: function() {
            var that = this;
            $('.leaflet-top.leaflet-left').append(timelineControlPartial);
            that.model.init().done(function() {
                that.timeline = L.control.timeline(that.map,
                {   on: { brushend: function(a) { that.handleFilter(a);     }
                        , collapse: function()  { that._timelineCollapse(); }
                    }
                });
                that.timeline.addData(that.model);
                $('.leaflet-control-timeline.leaflet-control-timeline-collapsed').click(function(evt) {
                    $(evt.target).removeClass('leaflet-control-timeline-collapsed');
                    that.timeline.expand();
                });
            });
        }
        , handleFilter : function(selected) {
            this.trigger('filter', selected);
        }
    });
    return TimelineView;
});

