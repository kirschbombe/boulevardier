/*global define*/
define('views/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'leaflet'
    , 'text!partials/map.html'
    , 'views/marker'
    , 'mixins/asyncInit'
    , 'models/error/user'
    , 'views/error/user'
], function($,_,Backbone,L,mapPartial,MarkerView,AsyncInit,UserErrorModel,UserErrorView) {
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
                try {
                    that._initMap();
                    if (that.markerViews) {
                        var markerViewInits = _.map(that.markerViews, function(i) { i.$def });
                        $.when.apply({}, markerViewInits).done(function(){
                            that.$def.resolve(that);
                        });
                    } else {
                        throw "undefined marker views.";
                    }
                } catch (e) {
                    new UserErrorView({
                        model: new UserErrorModel({
                            msg: e.toString()
                        })
                    })
                }
            });
        }
        , _initMap : function() {
            var that = this;
            if ($('#' + this.id).length === 0) {
                $('body').append(mapPartial);
                that.map = new L.Map(that.mapconfig.id, that.mapconfig.map);
                if (that.mapconfig.view) {
                  try {
                    that.map.setView(
                        new L.LatLng(that.mapconfig.view.lat, that.mapconfig.view.lng)
                      , that.mapconfig.view.zoom
                    );
                  } catch (e) {
                    new UserErrorView({model: new UserErrorModel({
                        msg: 'Leaflet reports bad data in map.json file. ' + e.toString()
                    })});
                  }
                }
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
