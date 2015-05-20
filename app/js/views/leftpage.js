/*global define*/
define('views/leftpage', [
    'jquery', 
    'underscore', 
    'backbone',
    'text!partials/page.html'
], function($,_,Backbone,tmpl) {
    'use strict';
    var LeftPageView = Backbone.View.extend({
        el: '#left-content',
        template: _.template(tmpl),
        render: function (content) {
            this.$el.empty().append(
                this.template(content)
            );
        }
    });    
    return LeftPageView;
});
