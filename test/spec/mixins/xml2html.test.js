/*global define */
/* jshint expr:true */
define([
      'text!fixtures/input/1.xml'
    , 'text!fixtures/output/1-article-menu.html'
    , 'text!fixtures/output/1-article.html'
    , 'text!fixtures/output/1-geojson.json'
    , 'text!xsl/article-menu.xsl'
    , 'text!xsl/article.xsl'
    , 'text!xsl/geojson.xsl'
    , 'mixins/xml2html'
    , 'underscore'
], function (in1,in1am,in1a,in1g,amXsl,aXsl,gXsl,XML2HTML,_) {
  'use strict';
  
  describe("[Testing collections/articles constructor & init]:", function () {
      it('expect xml2html to raise exception on invalid input object',function(){
        expect(function() { XML2HTML.xml2html([], ""); }).to.throw('Unrecognized document input in XML2HTML');
      });
      it('expect xml2html to raise exception on unparsable XML string',function(){
        expect(function() { XML2HTML.xml2html("a", ""); }).to.throw('Failed to parse document in xml2html');
      });
      it('expect article-menu.xsl to output correct result',function(){
        var result = XML2HTML.xml2html(in1, amXsl, {'href':'#'});
        expect(result).to.equal(in1am);
      });      
      it('expect article.xsl to output correct result',function(){
        var result = XML2HTML.xml2html(in1, aXsl);
        
console.log('---------------------');
console.log(result);
console.log('---------------------');

        expect(result).to.equal(in1a);
      });
/*
      it('expect geojson.xsl to output correct result',function(){
        var result = XML2HTML.xml2html(in1, gXsl, null, 'text');
        expect(_.equal(
            JSON.parse(result),
            JSON.parse(in1g)
        )).to.be(true);
      });
*/  });
});
