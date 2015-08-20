/*global define */
define('models/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'mixins/asyncInit'
], function($,_,Backbone,AsyncInit) {
    'use strict';
    var MapModel = Backbone.Model.extend({
        initialize: function(args) {
            var that  = this;
            that.$def = $.Deferred();
            $.getJSON(args.config.map.config, function(data) {
                that.set('mapconfig', data);
                that.$def.resolve(that);
            }).fail(function(jqxhr, textStatus, error) {
                console.log('Failed to load map config file: ' + error);
                that.$def.reject();
            });
        },
        defaults: {
            "mapconfig" : {}
        },
    });
    _.extend(MapModel.prototype,AsyncInit);
    return MapModel;
});
