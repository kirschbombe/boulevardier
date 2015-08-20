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
            that._handleFilter({clear:true});
        }
        , _handleFilter : function(selected) {
            this.trigger('filter', selected);
        }
        , render: function() {
            var that = this;
            that.model.init().done(function() {
                that.timeline = L.control.timeline(that.map,that.model,
                    {   on: { brushend: function(a) { that._handleFilter(a);    }
                            , collapse: function()  { that._timelineCollapse(); }
                    }
                }).addTo(that.map);
            });
        }
    });
    return TimelineView;
});

