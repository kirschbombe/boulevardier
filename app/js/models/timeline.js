/*global define */
define('models/timeline', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'collections/timeline'
    , 'models/timeline/item'
    , 'mixins/asyncInit'
], function($,_,Backbone,TimelineCollection,TimelineItem,AsyncInit) {
    'use strict';
    var TimelineModel = Backbone.Model.extend({
          markerViews: null
        , start: null
        , end: null
        , siteconfig : null
        , bookconfig : null
        , initialize: function(args) {
            var that = this;
            that.markerViews = args.markerViews;
            that.siteconfig = args.siteconfig;
            that.$def = $.Deferred();
            $.getJSON(that.siteconfig.book.file, function(data) {
                that.bookconfig = data.book;
                that._initialize();
                that.$def.resolve(that);
            }).fail(function(jqxhr, textStatus, error) {
                that.$def.reject();
            });
        }
        , _initialize : function() {
            var that = this;
            var col = new TimelineCollection();
            that.set('collection', col);
            _.forEach(that.markerViews, function(markerView) {
                var model = markerView.model;
                var bookChapter = _.findWhere(that.bookconfig.chapters, {
                      part    : model.attributes.citedRange.part
                    , chapter : model.attributes.citedRange.chapter
                });
                if (!bookChapter) return;
                var start = bookChapter.paragraphs.start
                          + model.attributes.citedRange.paragraph;
                var end = start + 1;
                col.add(new TimelineItem({
                      start: start
                    , end: end
                    , markerView: markerView
                }));
            });
            that.start = _.min(that.bookconfig.chapters, function(chapter) {
                return chapter.paragraphs.start;
            }).paragraphs.start;
            that.end = _.max(that.bookconfig.chapters, function(chapter){
                return chapter.paragraphs.end;
            }).paragraphs.end;
        }
        , getItems : function() {
            return this.get('collection').models;
        }
        , tickValues : function() {
            var values = _.map(this.bookconfig.chapters, function(chapter){
                return chapter.paragraphs.start;
            });
            values.sort(function(a,b) { return a-b; });
            return values;
        }
        , tickFormat : function(p) {
            var that = this;
                var i,chapter;
                for (i = 0; i < that.bookconfig.chapters.length; ++i) {
                    chapter = that.bookconfig.chapters[i];
                    if (p <= chapter.paragraphs.end) {
                        p = chapter.chapter;
                        // blank tick for end of book
                        if (p === that.bookconfig.chapters.length - 1) {
                            return '';
                        }
                        return p;
                    }
                }
                return "";

            _.findIndex(this.get('collection').models, function(item){
                return (item.cid === timelineItem.cid);
            });
            if (!i) return;
            return this.get('collection').get(i);
        }
    });
    _.extend(TimelineModel.prototype,AsyncInit);
    return TimelineModel;
});
