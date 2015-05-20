/*global define*/
define('views/issue', [
    'jquery', 
    'underscore', 
    'backbone',
    'text!partials/issue.html'
], function($,_,Backbone,tmpl) {
    'use strict';
    var IssueView = Backbone.View.extend({
        el: '#issue',
        template: _.template(tmpl),
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            this.app.fetch('models/issue').done(function(issue) {
                that.model = issue;
                that.init.resolve(that);
            });
        },
        render: function () {
            this.$el.remove();
            $('body').append(tmpl);
        }
    });
    return IssueView;
});
