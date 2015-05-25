/*global define */
/* jshint expr:true */
define([
    'collections/articles'
], function (ArticlesCollection) {
  'use strict';
  describe("[Testing collections/articles constructor & init]:", function () {
      it('expect constructor to be a function',function() {
        expect(ArticlesCollection).to.be.an('function');
      });
      it('expect collection to be an object',function() {
        var col = new ArticlesCollection();
        expect(col).to.be.an('object');
      });
  });
});
