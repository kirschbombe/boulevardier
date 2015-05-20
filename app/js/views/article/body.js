/*global define */
define('views/article/body', [
    'jquery', 
    'underscore', 
    'backbone', 
    'views/article/section', 
    'text!xsl/body.xsl'
], function($,_,Backbone,SectionView,xsl) {
    'use strict';
    var BodyView = SectionView.extend({
        el      : '#body',
        $el     : $('#body'),
        xsl     : xsl,
        name    : 'body',
        // dynamically set height of this section
        render: function () {
            var html = this.xml2html(this.model.get('xml'),this.xsl,this.params);
            this.$el.append(html);
            //this.$el.height(500);
            return this;
        }
    });
    return BodyView;
});
