/*global define */
define('models/map/layer/timeline/item', [
      'jquery'
    , 'underscore'
    , 'backbone'
], function($,_,Backbone) {
    'use strict';
    var TimelineItemModel = Backbone.Model.extend({
          markerView: null
        , start: null       // "absolute" start (ie, paragraph index w/o chapter)
        , end: null         // "absolute" end
        , initialize: function(args) {
            var that = this;
            that.markerView = args.markerView;
            that.start = args.start;
            that.end = args.end;
        }
        , duration: function() {
            return this.end-this.start;
        }
        , compareTo: function(b) {
            return 
        }
    });
    return TimelineItemModel;
});
