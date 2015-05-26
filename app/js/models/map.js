/*global define */
define('models/map', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'collections/markers'
    , 'models/marker'
    , 'mixins/asyncInit'
], function($,_,Backbone,MarkersCollection,MarkerModel,AsyncInit) {
    'use strict';
    var MapModel = Backbone.Model.extend({
        initialize: function(args) {
            var that    = this;
            that.$def   = $.Deferred();
            that.issue  = args.issue;
            if (that.issue === undefined) throw new Error('Missing issue model in map model');
            that.set('router', args.router);
            if (!args.router) throw new Error('No router in MapModel');
            var $configDef = $.Deferred();
            $.getJSON(args.config.map.config, function(data) {
                that.set('mapconfig', data);
                $configDef.resolve();
            }).fail(function(jqxhr, textStatus, error) {
                $configDef.reject();
                console.log('Failed to load map config file: ' + error);
            });
            $.when.apply({},[that.issue.init(), $configDef]).done(function() {
                that._makeCollection(that.issue.get('collection').models, {
                    success: function() { that.$def.resolve(that); },
                    fail:    function() { that.$def.reject();      }
                });
            // TODO: issue as to whether fail()/always() is called on failure here;
            // fail() should be called on falure
            }).fail(function() {
                that.$def.reject();
            }).always(function(){
                that.$def.reject();
            });
        },
        defaults: {
            "mapconfig"     : {}
        },
        _makeCollection : function(articles,cbs) {
            var that = this;
            var deferreds = [];
            var col = new MarkersCollection();
            that.set('collection', col);
            var markers = _.map(_.range(articles.length), function(){return undefined;});
            var error = false;
            var errorMsg = '';
            articles.forEach(function(article,i){
                var $artDef = $.Deferred();
                deferreds.push($artDef);
                article.init().done(function() {
                    var mm;
                    try {
                        mm = new MarkerModel({
                              issue     : that.issue
                            , article   : article
                            , json      : article.geojson()
                            , router    : that.router
                        });
                    // on failure to create geojson from article, warn
                    // but do not block map
                    } catch (e) {
                        error = true;
                        errorMsg += ("\n" + e.toString());
                        $artDef.resolve();
                        return;
                     }
                    markers[i] = mm;
                    $artDef.resolve();
                });
            });
            $.when.apply({},deferreds).done(function() {
                col.add(markers);
                if (error) throw new Error(errorMsg);
                cbs.success();
            }).fail(function() {
                cbs.fail();
            });
        }
    });
    _.extend(MapModel.prototype,AsyncInit);
    return MapModel;
});
