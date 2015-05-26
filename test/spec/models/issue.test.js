/*global define */
define([
      'jquery'
    , 'models/marker'
    , 'models/article'
    , 'models/issue'
], function ($,MarkerModel,ArticleModel,IssueModel) {
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
  describe("[Testing models/issue initialization]", function () {

    it('expect full init with a single article',function(done) {
      var issue = new IssueModel(issueArgs);
      issue.init().done(function(is) {
        expect(is === undefined).to.equal(false);
        expect(is.init().state()).to.equal('resolved');
        done();
      });
    });

    it('expect failed init with a missing article',function(done) {
      this.timeout(10000);
    
      var badArgs = JSON.parse(JSON.stringify(issueArgs));
      badArgs.config.articles.files = ['1.xml','-1.xml'];
      var issue = new IssueModel(badArgs);
      expect(issue === undefined).to.equal(false);

      issue.init().done(function() {
         expect(false).to.equal(true);
      }).fail(function() {
        expect(issue.init().state()).to.equal('rejected');
      }).always(function(){
          done();
      });
    });
    
  });

  describe("[Testing models/issue event linkage]", function () {

    it('expect models/issue to trigger article object "active" event', function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');
          
          var article = issue.get('collection').at(0);
          expect(article === undefined).to.equal(false);
          
          article.on('active', function() { 
            expect(true).to.equal(true);
            done();
          });
          window.setTimeout(function(){
              issue.trigger('select', article);
          },eventLatency);
      });
    });
    
    it('expect models/issue to trigger article index "active" event', function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');
          
          var article = issue.get('collection').at(0);
          expect(article === undefined).to.equal(false);
          
          
          article.on('active', function() { 
            expect(true).to.equal(true);
            done();
          });
          window.setTimeout(function(){
              issue.trigger('select', 0);
          },eventLatency);
      });
    });
    
  });
});
