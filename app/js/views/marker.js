/*global define*/
define('views/marker', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'models/error/user'
    , 'views/error/user'
    , 'text!partials/marker.html'
    , 'text!partials/marker-legend.html'
    , 'mixins/asyncInit'
], function($,_,Backbone,UserErrorModel,UserErrorView,tmpl,legendPartial,AsyncInit) {
    'use strict';
    var MarkerView = Backbone.View.extend({
          template: _.template(tmpl)
        , el: ''
        , markerLayer: null
        , map: null
        , mapconfig: null
        , initialize: function(args) {
            var that = this;
            that.$def = $.Deferred();
            that.map = args.map;
            that.mapconfig = args.mapconfig;
            try {
                that.initMarkerLayer();
                if (that.markerLayer) {
                    that.$def.resolve(that);
                } else {
                    throw "Failed to initialize marker layer."
                }
            } catch (e) {
                new UserErrorView({
                    model: new UserErrorModel({
                        msg: e.toString()
                    })
                })
            }
        }
        , initMarkerLayer : function() {
            var that    = this;
            var geojson = this.model.getGeojson();
            var iconConfig = that.mapconfig.features.icon;
            iconConfig.iconUrl = (this.model.get('iconUrl') || '');
            var icon = L.icon(iconConfig);
            that.markerLayer = L.geoJson(geojson, {
                onEachFeature: function (feature, mapMarker) {
                    // add the popup to this marker
                    var popup = L.popup(that.mapconfig.features.popup);
                    popup.setContent(
                        that.template({
                            articleid:  that.model.get('articleid'),
                            geojson:    that.model.getGeojson()
                        })
                    );
                    mapMarker.bindPopup(popup);
                    // override the default click handler for the
                    // marker, which would close the popup if it
                    // were already open
                    mapMarker.removeEventListener('click');
                    mapMarker.on('click', function(evt) {
                        that.trigger('click', evt);
                    });
                    mapMarker.on('mouseover', function(evt) {
                        that.trigger('mouseover', evt);
                    });
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                          icon        : icon
                        , clickable   : !!feature.properties.text
                        , title       : (feature.properties.markername || '')
                        , opacity     : that.mapconfig.features.opacity
                        , riseOnHover : that.mapconfig.features.riseOnHover
                    });
                }
            });
        }
        , render: function() {
            var that = this;
            try {
                if (this.markerLayer) {
                    this.markerLayer.addTo(this.map);
                } else {
                    var article = that.model.get('path');
                    throw "map marker layer is undefined for article '"
                        + article + "'. Check lat/lng values in file."
                }
            } catch (e) {
                new UserErrorView({
                    model: new UserErrorModel({
                        msg: "Error adding marker layer: " + e.toString()
                    })
                })
            }
        }
    });
    _.extend(MarkerView.prototype,AsyncInit);
    return MarkerView;
});
