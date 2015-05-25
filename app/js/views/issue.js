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
            that.model = args.issue;
            that.model.on('update', function(article) {
                that.select(article);
            });
        },
        render: function () {
            this.$el.remove();
            $('body').append(tmpl);
        },
        select: function(article) {
            var that = this;
            var av = new ArticleView({
                  model:  article
                , config: that.model.config
                , issue:  that
                , router: that.model.router
            });
            article.on('active',   av.render, av);
            article.on('inactive', av.remove, av);
        }
    });
    return IssueView;
});
