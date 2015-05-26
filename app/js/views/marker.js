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
        initialize: function(args) {
            var that = this;
            that.router = args.router;
            // when a marker is made active (e.g., by selection
            // of a mark in the map), propogate the event to the
            // issue, for updates elsewhere in the application
            that.model.on('active', function() {
                var url = 'article/' + that.model.article.get('articleid');
                that.router.navigate(url, {trigger: true});
                // ensure that the article is has been selected
                that.model.get('issue').trigger('select', that.model.get('article'));
            });
        }
        // retain empty function to avoid redraw/collapse of
        // map marker popover
        , render: function() {
            this.$el.html(
                this.template({
                    articleid:  this.model.article.get('articleid'),
                    geojson:    this.model.article.geojson()
                })
            );
        }
    });
    return MarkerView;
});
