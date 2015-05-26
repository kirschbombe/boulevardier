/*global define */
define([
      'jquery'
    , 'models/app'
], function ($,AppModel) {
  'use strict';
  var appArgs = {
      "articles": {
            pathBase: 'http://localhost:9876/base/test/fixtures/input'
          , files: ['1.xml']
      },
      "pages" : { "pathBase"  : "pages/",
                  "home"      : "test",
                  "routes" : {
                        ""              : "page",
                        "article/:id"   : "article",
                        "page/:page"    : "page"
                 },
                 "router" : { "history" : false      },
                 "pages"  : { "test" : []            }
     }
  };
  describe("[Testing models/app instantiation]", function () {
    it('expect app to initialize with minimal data',function() {
        var app = new AppModel({
            config: appArgs
        });
        expect(app === undefined).to.equal(false);
    });
    it('expect app to throw error on malformed config data',function() {
        try {
            var app = new AppModel({config:{}});
        } catch (e) {
            expect(true).to.equal(true);
            return;
        }
        expect(true).to.equal(false);
    });
  });
});
