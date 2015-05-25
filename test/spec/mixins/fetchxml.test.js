/*global define */
define([
      'jquery'
    , 'text!fixtures/input/1.xml'
    , 'mixins/fetchxml'
    , 'utils'
], function ($,xml,fetch,utils) {
  'use strict';
  describe("[Testing mixins/fetchXML: promise]", function () {
      it('expect fetchXML to return a promise',function(done){
          var $def = fetch.fetchXML('http://localhost:9876/base/test/fixtures/input/1.xml');
          expect($def.hasOwnProperty('state')).to.equal(true);
          done();
      });
  });
  describe("[Testing mixins/fetchXML: result]", function() {
      it('expect fetchXML return expected result',function(done) {
        var $def = fetch.fetchXML('http://localhost:9876/base/test/fixtures/input/1.xml');
        var xmlDoc = new DOMParser().parseFromString(xml,'text/xml').documentElement;
        $def.done(function(result){
            expect(utils.diff(xmlDoc,result.documentElement)).to.equal(true);
            done();
        });
      });
  });
});
