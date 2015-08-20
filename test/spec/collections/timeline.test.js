/*global define */
/* jshint expr:true */
define([
      'collections/timeline'
    , 'backbone'
], function (TimelineCollection) {
  'use strict';
  describe('"Testing collections/markers constructor & init"', function () {
      it('expect constructor to be a function',function(){
        expect(TimelineCollection).to.be.a('function');
      });
      it('expect collection to be an object',function(){
        var col = new TimelineCollection();
        expect(col).to.be.an('object');
      });
  });
});
