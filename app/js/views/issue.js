/*global define*/
define('views/issue', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/issue.html'
    , 'views/article'
], function($,_,Backbone,tmpl,ArticleView) {
    'use strict';
    var IssueView = Backbone.View.extend({
        el:         '#issue',
        template:   _.template(tmpl),
        initialize: function(args) {
            var that = this;
            that.config = args.config;
        },
        render: function () {
            this.$el.remove();
            $('body').append(tmpl);
        },
        renderArticle: function(article) {
            new ArticleView({
                  model:  article
                , config: this.model.config
                , issue:  this
                , router: this.model.router
            }).render();
        }
    });
    return IssueView;
});
