/* global define, describe, it, beforeEach */
/* jshint expr:true */
define(function (require) {
  'use strict';

  var
  chai,
  expect,
  assert,
  foo,
  app,
  beverages;

  chai = require('chai');
  expect = chai.expect;
  assert = chai.assert;
  app = require('app');

  describe('Testing chai', function () {

    describe('basic assetions', function () {

      it('expect foo to be string',function(){
        foo = 'bar',
        beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
        expect(foo).to.be.a('string');
      });
      it('expect foo to be equal',function(){
        expect(foo).to.equal('bar');
      });
      it('expect foo to have',function(){
        expect(foo).to.have.length(3);
      });
      it('expect foo to have property',function(){
        expect(beverages).to.have.property('tea').with.length(3);
      });
    });
  });

  describe('testing chai.assert', function () {

    describe('basic assertions', function () {

      foo = 'bar',
      beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

      it('assert typeOf',function(){
        assert.typeOf(foo, 'string', 'foo is a string');
      });
      it('assert equal',function(){
        assert.equal(foo, 'bar', 'foo equal `bar`');
      });
      it('assert lengthOf',function(){
        assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
      });
      it('assert lengthOf',function(){
        assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
      });

    });
  });

  describe('testing Asynchronous code', function(){

    foo = false;
    beforeEach(function(done){
      setTimeout(function(){
        foo = true;
        done();
      }, 50);
    });

    it('Asynchronous callback done', function(){
      expect(foo).equals(true);
    });

  });

  describe('testing app', function(){

    it('app exists', function(){
      expect(app).to.be.an('object');
    });

    it('app router', function(){
      expect(app.Router).to.be.an('object');
    });

    it('app VERSION', function(){
      expect(app.VERSION).to.be.a('string');
    });

    it('app Backbone', function(){
      expect(app.Backbone).to.be.an('object');
    });

    it('app _', function(){
      expect(app._).to.be.a('function');
    });

    it('app $', function(){
      expect(app.$).to.be.a('function');
    });

  });

});

