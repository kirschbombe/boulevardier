/*global define */
/* jshint expr:true */
define([
      'text!config/site.json'
    , 'collections/markers'
    , 'models/marker'
    , 'jquery'
    , 'underscore'
    , 'backbone'
], function (configJson,MarkersCollection,MarkerModel,$,_,Backbone) {
  'use strict';
  var config = JSON.parse(configJson);
  
  describe('"Testing collections/markers constructor & init"', function () {
      it('expect constructor to be a function',function(){
        expect(MarkersCollection).to.be.an('function');
      });
      it('expect collection to be an object',function(){
        var $colDef = $.Deferred();
        var col = new MarkersCollection({model: MarkerModel, init: $colDef});
        expect(col).to.be.an('object');
      });
      it('expect marker collection to resolve on "complete" event',function(){
        var $colDef = $.Deferred();
        var col = new MarkersCollection({model: MarkerModel, init: $colDef});
        expect(col).to.be.an('object');
        expect($colDef.state()).to.equal('pending');
        col.trigger('complete');
        expect($colDef.state()).to.equal('resolved');
      });

  });

});
