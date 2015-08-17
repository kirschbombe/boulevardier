/*global define*/
define('controllers/issue', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'controllers/prototype'
    , 'mixins/asyncInit'
    , 'views/issue'
    , 'models/issue'
], function($,_,Backbone,Controller,AsyncInit,IssueView,IssueModel) {
    'use strict';
    var IssueController = Controller.extend({
          model: null
        , view : null
        , router: null
        , initialize: function(args) {
            var that = this;
            that.$def = $.Deferred();
            that.router = args.router;
            that.model = new IssueModel({ config: args.config });
            that.view = new IssueView({
                  model: that.model
                , config: args.config
            });
            that.view.render();
            that.model.init().done(function() {
                _.forEach(that.model.get('collection').models, function(article) {
                    that.listenTo(article, 'active', function(article) {
                        var url = 'article/' + article.get('articleid');
                        that.router.navigate(url, {trigger: true});
                        that.view.renderArticle(article);
                        //that.trigger('active');
                        //that.handlePopupPosition(map,markerView.popup);
                    });
                });
                that.$def.resolve(that);
            }).always(function() {
                that.$def.reject();
            });
        }
    });
    _.extend(IssueController.prototype,AsyncInit);
    return IssueController;
});
