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
    , 'utils'
], function (in1,in1am,in1a,in1g,amXsl,aXsl,gXsl,XML2HTML,_,utils) {
  'use strict';
  describe("[Testing mixins/xml2html]:", function () {
      it('expect xml2html to raise exception on invalid input object',function(){
        expect(function() { XML2HTML.xml2html([], ""); }).to.throw('Unrecognized document input in XML2HTML');
      });
      it('expect xml2html to raise exception on unparsable XML string',function(){
        expect(function() { XML2HTML.xml2html("<a", ""); }).to.throw('Failed to parse document in xml2html');
      });
      it('expect article-menu.xsl to output correct result',function(){
        var result = XML2HTML.xml2html(in1, amXsl, {'href':'#'});
        var in1amDoc = new DOMParser().parseFromString(in1am,'text/xml').documentElement;
        expect(result.documentElement == in1amDoc.documentElement).to.equal(true);
      });
      it('expect article.xsl to output correct result',function(){
        var orig    = new DOMParser().parseFromString(in1a,'text/xml').documentElement;
        var result  = new DOMParser().parseFromString(XML2HTML.xml2html(in1, aXsl),'text/xml').documentElement;
        expect(utils.diff(orig,result)).to.equal(false);       
      });
      it('expect geojson.xsl to output correct result',function() {
        var result = XML2HTML.xml2html(in1, gXsl, null, 'text');
        expect(_.isEqual(
            JSON.parse(result),
            JSON.parse(in1g)
        )).to.equal(true);
      });
  });
});
