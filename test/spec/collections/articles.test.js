/*global define */
/* jshint expr:true */
define([
      'text!config/site.json'
    , 'collections/articles'
    , 'models/article'
    , 'jquery'
    , 'underscore'
    , 'backbone'
], function (configJson,ArticlesCollection,ArticleModel,$,_,Backbone) {
  'use strict';
  var config = JSON.parse(configJson);
  
  describe("[Testing collections/articles constructor & init]:", function () {
  
      it('expect constructor to be a function',function(){
        expect(ArticlesCollection).to.be.an('function');
      });

      it('expect collection to be an object',function(){
        var $colDef = $.Deferred();
        var col = new ArticlesCollection({model: ArticleModel, init: $colDef});
        expect(col).to.be.an('object');
      });

      it('{expect article collection to resolve on "complete" event',function(){
        var $colDef = $.Deferred();
        var col = new ArticlesCollection({model: ArticleModel, init: $colDef});
        expect(col).to.be.an('object');
        expect($colDef.state()).to.equal('pending');
        col.trigger('complete');
        expect($colDef.state()).to.equal('resolved');
      });
  });

});
