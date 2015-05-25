/*global define*/
define('views/issue', [
    'jquery', 
    'underscore', 
    'backbone',
    'text!partials/issue.html'
], function($,_,Backbone,tmpl) {
    'use strict';
    var IssueView = Backbone.View.extend({
        el:         '#issue',
        template:   _.template(tmpl),
        render: function () {
            this.$el.remove();
            $('body').append(tmpl);
        }
    });
    return IssueView;
});
