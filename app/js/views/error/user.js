/*global define*/
define('views/error/user', [
    'jquery', 
    'backbone', 
    'text!partials/error/user.html'
], function($,Backbone,tmpl) {
    'use strict';
    var UserErrorView = Backbone.View.extend({
        template: _.template(tmpl),
        el: $('#errorDialog'),
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            this.$el.modal({keyboard: true, show: true});
            return this;
        }
    });
    return UserErrorView;
});
