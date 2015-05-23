/*global define */
/*
initialize: function(args,props) {
    var that = this;
    that.app = props.app;
    that.init = props.init;
    that.on('complete', function() {
        that.init.resolve(that);
    });
}
*/
/* global define, describe, it, beforeEach */
/* jshint expr:true */
define([
      'models/app'
    , 'text!config/site.json'
    , 'collections/markers'
    , 'models/article'
    , 'jquery'
    , 'underscore'
    , 'backbone'
], function (AppModel,configJson,MarkersCollection,MarkerModel,$,_,Backbone) {
  'use strict';
  
  var config = JSON.parse(configJson);
  
  describe('Testing collections/markers constructor & init', function () {
      it('expect constructor to be a function',function(){
        expect(MarkersCollection).to.be.an('function');
      });
      it('expect collection to be an object',function(){
        var app = new AppModel({config: config});
        var $colDef = app.singletons['collections/markers'];
        var col = new MarkersCollection(null, {model: MarkerModel, app: app, init: $colDef});
        expect(col).to.be.an('object');
      });
  });

  describe('testing Asynchronous code', function(){

    beforeEach(function(done){
      setTimeout(function(){
        done();
      }, 50);
    });

    it('Asynchronous callback done', function(){
      expect(true).equals(true);
    });

  });

});
