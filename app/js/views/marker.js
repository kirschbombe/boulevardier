/*global define*/
define('views/marker', [
    'jquery',
    'underscore',
    'backbone',
    'text!partials/marker.html'
], function($,_,Backbone,tmpl) {
    'use strict';
    var MarkerView = Backbone.View.extend({
        template: _.template(tmpl),
        el: '',
        router: null,
        iconUrl: '',
        popup: null,
        mapMarker: null,
        legendClass: '',
        initialize: function(args) {
            var that = this;
            that.router = args.router;
            that.iconUrl = args.iconUrl;
            that.iconTitle = args.iconTitle;
            that.legendClass = '.' + that.iconTitle.replace(/\s+/g, '-');
            that.model.on('active', function() {
                var url = 'article/' + that.model.article.get('articleid');
                that.router.navigate(url, {trigger: true});
                that.trigger('active');
            });
            that.model.on('toggle', function() {
                that.trigger('toggle');
            });
        }
        , render: function() {
            var that = this;
            this.$el.html(
                this.template({
                    articleid:  this.model.article.get('articleid'),
                    geojson:    this.model.article.getGeojson(),
                    iconUrl:    this.iconUrl,
                    iconTitle:  this.iconTitle
                })
            );
            this.$el.find('img.icon').hover(
                function(evt) {
                    $('.leaflet-control-layers.leaflet-control').addClass('leaflet-control-layers-expanded');
                    $('.leaflet-control-layers.leaflet-control').find(that.legendClass).addClass('legend-highlight');
                },
                function(evt) {
                    $('.leaflet-control-layers.leaflet-control').removeClass('leaflet-control-layers-expanded');
                    $('.leaflet-control-layers.leaflet-control').find(that.legendClass).removeClass('legend-highlight');
                }
            );
        }
    });
    return MarkerView;
});
