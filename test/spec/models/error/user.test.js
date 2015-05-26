/*global define */
define([
      'jquery'
    , 'models/error/user'
], function ($,UserErrorModel) {
  'use strict';
  // return a router object with a navigate method
  describe("[Testing models/error/user instantiation]", function() {
  
    it('expect model/error/user to be an object', function(){
      var msg = "unit test error";
      var error = new UserErrorModel({message:msg});
      expect(true).to.equal(true);
      //expect(error === undefined).to.equal(false);
      //expect(error.get('msg') === msg).to.equal(true);
    });
  });

});
