/*global define*/
define('views/map/layer/timeline', [
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
            var position, controlheight, mapheight, documentheight;
            mapheight = $('#map').height();
            documentheight = document.body.clientHeight;
            if (Math.abs(documentheight/2 - mapheight) < 2) {
                position = 'bottomright';
                controlheight = $('#map').height() - 100;
            } else {
                position = 'topleft';
                controlheight = 500;
            }
            that.model.init().done(function() {
                that.timeline = L.control.timeline(that.map,that.model,
                    {     height   : controlheight
                        , position : position
                        , on: { brushend: function(a) { that._handleFilter(a); }}}
                ).addTo(that.map);
            });
        }
    });
    return TimelineView;
});

