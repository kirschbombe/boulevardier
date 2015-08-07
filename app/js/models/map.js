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
            var that   = this;
            that.$def  = $.Deferred();
            that.issue = args.issue;
            that.set('siteconfig', args.config);
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
            , "siteconfig"    : {}
            , "iconUrls"      : {}
        },
        _makeCollection : function(articles,cbs) {
            var that = this;
            var col = new MarkersCollection();
            that.set('collection', col);
            var markers = new Array(articles.length);
            var error = false;
            var errorMsg = '';
            var icons = that.get('iconUrls');
            var icconfig  = that.attributes.siteconfig.markers.icons;
            var iconFiles = _.shuffle(_.flatten(
                _.map(icconfig, function(entry) {
                    return _.map(entry.files, function(file) {
                        return entry.dir.concat(file);
                    });
                })
            ));
            // do map marker icon initialization; this seems like it should
            // be isolated to the MapView or MarkerView, but is data used
            // elsewhere in the application, so they are assigned here
            articles.forEach(function(article,i) {
                var geojson = (article.getGeojson() || {"properties":{}});
                var layer = geojson.properties.layer;
                icons[layer] = icons[layer] || iconFiles.pop();
                article.set('iconUrl', icons[layer]);
            });
            // articles have completed initialization since
            // the issue has, so
            articles.forEach(function(article,i) {
                var mm;
                try {
                    mm = new MarkerModel({
                          issue     : that.issue
                        , article   : article
                        , json      : article.getGeojson()
                        , router    : that.router
                        , iconUrl   : icons[article.get('placeType')]
                    });
                    article.set('marker', mm);
                // on failure to create geojson from article, warn
                // but do not block map
                } catch (e) {
                    error = true;
                    errorMsg += ("\n" + e.toString());
                    return;
                 }
                markers[i] = mm;
            });
            if (error) {
                cbs.fail();
                throw new Error(errorMsg);
            }
            col.add(markers);
            cbs.success();
        }
    });
    _.extend(MapModel.prototype,AsyncInit);
    return MapModel;
});
