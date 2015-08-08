/*global define */
define([
      'jquery'
    , 'models/issue'
    , 'models/map'
], function ($,IssueModel,MapModel) {
  'use strict';
  // return a router object with a navigate method
  function mkRouter(cb) {
      return {
          navigate: function(url,opts) {
              cb(url,opts);
          }
      }
  }
  var siteConfig = {
        "map" : { "config" : "/base/test/config/map.json" }
      , "markers" : {
            "icons" : [
                { "dir"   : "app/icons/",
                    "files" : [
                        "noun_33862_cc_aqua.svg"
                    ]
        }]}
  };
  var issueArgs = {
      config: { articles: {
            pathBase: 'http://localhost:9876/base/test/fixtures/input'
          , files: ['1.xml']
      }}
  };
  describe("[Testing models/map instantiation]", function () {
    it('expect map to initialize with correct number of markers',function(done){
      var issue = new IssueModel(issueArgs);
      issue.init().then(function() {
          expect(issue.init().state()).to.equal('resolved');

          var map = new MapModel({
              issue  : issue
            , router : mkRouter(function(url,opts){})
            , config : siteConfig
          });
          expect(map === undefined).to.equal(false);
          
          map.init().done(function(){
              expect(map.get('collection').models.length === 1).to.equal(true);
              done();
          });
        });
    });
  });

});
