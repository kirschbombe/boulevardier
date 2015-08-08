/*global define */
define([
      'jquery'
    , 'models/marker'
    , 'views/marker'
    , 'models/article'
    , 'models/issue'
], function ($,MarkerModel,MarkerView,ArticleModel,IssueModel) {
  'use strict';
  var issueArgs = {
      config: { articles: {
            pathBase: 'http://localhost:9876/base/test/fixtures/input'
          , files: ['1.xml']
      }}
  };
  // amount of time for initialization before event handling can be
  // expected to work effectively
  var eventLatency = 100;
  describe("[Testing models/marker event linkage]", function () {

    it('expect marker to trigger issue "select" event',function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');
          
          var article = issue.get('collection').at(0);
          expect(article === undefined).to.equal(false);
          var router = {
              navigate: function(url,opts) {
                  expect(url === 'article/0').to.equal(true);
                  expect(opts.trigger).to.equal(true);
                  done();
              }
          };
          var marker = new MarkerModel({article: article, issue: issue});
          var markerView = new MarkerView({
            model     : marker, 
            router    : router,
            iconTitle : '', 
            iconUrl   : ''
          });
          issue.on('select', function(art) {
            expect(art === article).to.equal(true);
            done();
          });
          window.setTimeout(function(){
              marker.trigger('active');
          },eventLatency);
      });
    });

    it('expect marker to trigger article "active" event',function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');
          
          var article = issue.get('collection').at(0);
          expect(article === undefined).to.equal(false);
          var router = {
              navigate: function(url,opts) {
                  expect(url === 'article/0').to.equal(true);
                  expect(opts.trigger).to.equal(true);
                  done();
              }
          };
          var marker = new MarkerModel({article: article, issue: issue});
          var markerView = new MarkerView({
            model     : marker, 
            router    : router,
            iconTitle : '', 
            iconUrl   : ''
          });
          marker.on('active', function() { 
            expect(true).to.equal(true); 
            done();
          });
          window.setTimeout(function(){
              article.select();
          },eventLatency);          
      });
    });
    
    it('expect marker to call router "navigate" method',function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');
          
          var article = issue.get('collection').at(0);
          expect(article === undefined).to.equal(false);
          var router = {
              navigate: function(url,opts) {
                  expect(url === 'article/0').to.equal(true);
                  expect(opts.trigger).to.equal(true);
                  done();
              }
          };
          var marker = new MarkerModel({article: article, issue: issue});
          var markerView = new MarkerView({
            model     : marker, 
            router    : router,
            iconTitle : '', 
            iconUrl   : ''
          });
          window.setTimeout(function() {
              marker.trigger('active');
          }, eventLatency);
      });
    });

  });
});
