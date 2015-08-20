/*global define*/
define('views/marker', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/marker.html'
    , 'text!partials/marker-legend.html'
], function($,_,Backbone,tmpl,legendPartial) {
    'use strict';
    var MarkerView = Backbone.View.extend({
          template: _.template(tmpl)
        , el: ''
        , markerLayer: null
        , map: null
        , mapconfig: null
        , initialize: function(args) {
            var that = this;
            that.map = args.map;
            that.mapconfig = args.mapconfig;
            that.initMarkerLayer();
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
            this.markerLayer.addTo(this.map);
        }
    });
    return MarkerView;
});
