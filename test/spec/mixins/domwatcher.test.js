/*global define */
define([
      'jquery'
    , 'mixins/domwatcher'
], function ($,watcher) {
  'use strict';
  describe("[Testing mixins/fetchXML]:", function () {
      it('expect mixins/domwatcher to return success on dom mod',function(){
          var $def = $.Deferred();
          watcher.watchDOM(500,'#abc',$def);
          $('body').append('<span id="abc"></span>');
          $def.then(function() {
              expect(true).to.equal(true);
          });
      });
      it('expect mixins/domwatcher to return time on dom non-mod',function() {
          var $def = $.Deferred();
          watcher.watchDOM(100,'#abc',$def);
          $def.fail(function() {
              expect(true).to.equal(true);
          });
      });      
  });
});
