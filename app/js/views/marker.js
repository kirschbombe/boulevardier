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
        initialize: function() {
            this.$el.html(
                this.template({
                    articleid:  this.model.attributes.articleid,
                    geojson:    this.model.attributes.json
                })
            );
        }
        // retain empty function to avoid redraw/collapse of 
        // map marker popover
        //, render: function() {}
    });
    return MarkerView;
});
