/*global define */
define('models/map', [
    'jquery',
    'underscore',
    'backbone',
    'collections/markers',
    'models/marker',
    'views/marker',
    'views/article/geojson',
    'mixins/xml2html'
], function($,_,Backbone,MarkersCollection,MarkerModel,MarkerView,GeoJsonView,Xml2Html,xsl) {
    'use strict';
    var MapModel = Backbone.Model.extend({
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            // wait for the issue to be completely initialized
            var $m1 = that.app.fetch('models/issue');
            var artCol;
            var $m2 = $.Deferred();
            that.app.fetch('models/issue').done(function(issue) {
                that.app.fetch('collections/articles').done(function(col) {
                    artCol = col;
                    $m2.resolve();
                });
            });
            var $m3 = $.getJSON(that.app.config.map.config, function(data) {
                that.set('mapconfig', data);
            }).fail(function(jqxhr, textStatus, error) {
                console.log('Failed to load map config file: ' + error);
            });
            $.when($m1,$m2,$m3).done(function() {
                that._makeCollection(artCol, {
                    success: function() { that.init.resolve(that); },
                    fail:    function() { that.init.fail();        }
                });
            }).fail(function(jqxhr, textStatus, error) {
                console.log("Failed to init MapModel: " + error);
                $def.fail();
            });
        },
        defaults: {
            "init"          : false,
            //"mapconfigfile" : "",
            //"articles"      : null, // ArticlesCollection
            "mapconfig"     : {},
            "geojson"       : {}
        },
        show: function(id) {
            var col = this.get('collection');
            col.at(id).select();
        },
        _makeCollection : function(articles,cbs) {
            var that = this;
            // TODO: fix this, along with models/issue
            var $colDef = that.app.singletons['collections/articles'];
            var col = new MarkersCollection(null, {model: MarkerModel, app: that.app, init: $colDef});
            that.set('collection', col);
            // article initialization has an async call to fatch an article
            // file, so we need to initialize each marker in this map model's
            // collection in a deferred object that waits for its article
            // to be initialized
            var deferreds = [];
            articles.forEach(function(article) {
                var artid = article.get('articleid');
                var $artDef = $.Deferred();
                deferreds.push($artDef);
                article.init.done(function() {
                    var mm;
                    try {
                        mm = new MarkerModel({
                            articleid: article.get('articleid'),
                            json: (new GeoJsonView({model:article}).render())
                        });
                    // on failure to create geojson from article, warn
                    // but do not block map
                    } catch (e) {
                        new UserErrorView({
                            model: new UserErrorModel({msg: e.toString()})
                        });
                        $artDef.resolve();
                        return;
                     }
                    // select event for marker model changes visible article
                    mm.on('select', function(artid) {
                        that.app.router.navigate('article/' + artid, {trigger: true});
                    });
                    // TODO: for Leaflet integration, the view for this
                    // marker model is passed into the map view
                    // can do better?
                    var mv = new MarkerView({model: mm});
                    mm.set('view', mv);
                    col.add(mm);
                    $artDef.resolve();
                });
            });
            $.when.apply({},deferreds).done(function() {
                col.trigger('complete');
                cbs.success();
            }).fail(function() {
                cbs.fail();
            });
        }
    });
    _.extend(MapModel.prototype,Xml2Html);
    return MapModel;
});
