/*global define*/
define('views/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/map.html'
    , 'views/marker'
    , 'mixins/asyncInit'
], function($,_,Backbone,L,mapPartial,MarkerView,AsyncInit) {
    'use strict';
    var MapView = Backbone.View.extend({
          id:      'map'
        , tagName: 'div'
        , markerViews: [] // subviews
        , mapconfig: {}
        , initialize: function(args) {
            var that = this;
            that.$def = $.Deferred();
            that.model = args.model;
            that.issue = args.issue;
            $.when.apply({},[that.issue.init(), that.model.init()]).done(function() {
                that.mapconfig = that.model.get('mapconfig');
                if ($('#' + this.id).length > 0) return;
                if ($('#' + this.id).children().length > 0) return;
                that._initMap();                
                that.$def.resolve(that);
            });
        }
        , _initMap : function() {
            var that = this;
            if ($('#' + this.id).length === 0) {
                $('body').append(mapPartial);
                that.map = new L.Map(that.mapconfig.id, that.mapconfig.map);
                new L.TileLayer(that.mapconfig.tileLayer.url, that.mapconfig.tileLayer.opts).addTo(that.map);
                new L.control.scale(that.mapconfig.scale).addTo(that.map);                
                that.markerViews = _.map(that.issue.get('collection').models, function(article) {
                    return new MarkerView({
                          model     : article
                        , map       : that.map
                        , mapconfig : that.mapconfig
                    });
                });
            }
        }
        , render: function() {
            var that = this;
            that._initMap();
            _.forEach(that.markerViews, function(mv) { mv.render() });
            that.trigger('markers', that.markerViews);
        }
    });
    _.extend(MapView.prototype,AsyncInit);
    return MapView;
});
