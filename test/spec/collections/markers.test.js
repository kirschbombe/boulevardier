/*global define */
/* jshint expr:true */
define([
      'collections/markers'
    , 'backbone'
], function (MarkersCollection) {
  'use strict';
  describe('"Testing collections/markers constructor & init"', function () {
      it('expect constructor to be a function',function(){
        expect(MarkersCollection).to.be.a('function');
      });
      it('expect collection to be an object',function(){
        var col = new MarkersCollection();
        expect(col).to.be.an('object');
      });
  });
});
