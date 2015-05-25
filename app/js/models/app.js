/*global define */
define('models/app', [
    'jquery',
    'underscore',
    'backbone',
    'routes/router',
    'models/issue'
], function($,_,Backbone,Router,IssueModel) {
    'use strict';
    var AppModel = Backbone.Model.extend({
        initialize: function(opts) {
            var issue = new IssueModel({ config: opts.config });
            new Router({
                  routes: opts.config.pages.routes
                , config: opts.config
                , issue:  issue
            });
        }
    });
    return AppModel;
});
