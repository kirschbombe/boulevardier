/*global define*/
define('views/rightpage', [
    'jquery', 
    'underscore', 
    'backbone',
    'text!partials/page.html'    
], function($,_,Backbone,tmpl) {
    'use strict';
    var RightPageView = Backbone.View.extend({
        el: '#right-content',
        template: _.template(tmpl),
        render: function (content) {
            this.$el.empty().append(
                this.template(content)
            );
        }
    });
    return RightPageView;
});
