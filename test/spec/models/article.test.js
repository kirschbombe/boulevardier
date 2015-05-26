/*global define */
define([
      'jquery'
    , 'underscore'
    , 'models/article'
    , 'text!fixtures/output/1-geojson.json'
], function ($,_,ArticleModel,geojsonFixture) {
  'use strict';
  
  var path = 'http://localhost:9876/base/test/fixtures/input/1.xml';
  
  describe("[Testing models/article initialization]", function () {

    it('expect object on instantiation',function(done) {
        var article = new ArticleModel({path: path});
        article.init().done(function(art) {
            expect(art === undefined).to.equal(false);
            expect(art.init().state()).to.equal('resolved');
            expect(_.isFunction(art.fetchXML )).to.equal(true);
            expect(_.isFunction(art.init     )).to.equal(true);
            expect(_.isFunction(art.xml2html )).to.equal(true);
            done();
        });
    });
  });

  describe("[Testing models/article event linkage]", function () {

    it('models/article select method',function(done) {
        var article = new ArticleModel({path: path});
        article.on('active', function(){
            expect(true).to.equal(true);
            done();
        });
        article.init().done(function(art) {
            article.select();
        });
    });
    
    it('models/article unselect method',function(done) {
        var article = new ArticleModel({path: path});
        article.on('inactive', function(){
            expect(true).to.equal(true);
            done();
        });
        article.init().done(function(art) {
            article.unselect();
        });
    });
    
  });
  
  describe("[Testing models/article geojson]", function () {
    it('models/article produces expected geojson',function(done) {
    
        var article = new ArticleModel({path: path});
        article.init().done(function(art) {
            var res = article.geojson();
            expect(_.isEqual(res, JSON.parse(geojsonFixture))).to.equal(true);
            done();
        });
    });
  });

});
