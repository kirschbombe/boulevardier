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
        initialize: function(args) {
            var that = this;
            that.router = args.router;
            that.iconUrl = args.iconUrl;
            that.iconTitle = args.iconTitle;
            that.model.on('active', function() {
                var url = 'article/' + that.model.article.get('articleid');
                that.router.navigate(url, {trigger: true});
                that.trigger('active');
            });
        }
        , render: function() {
            this.$el.html(
                this.template({
                    articleid:  this.model.article.get('articleid'),
                    geojson:    this.model.article.getGeojson(),
                    iconUrl:    this.iconUrl,
                    iconTitle:  this.iconTitle
                })
            );
            this.$el.find('img.icon').popover({
                container: this.$el.find('span.icon')
            });
        }
    });
    return MarkerView;
});
