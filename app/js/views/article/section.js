/*global define*/
/*
 * This is meant to be extended as an abstract base class for the
 * sections of an article.
 */
define('views/article/section', [
    'jquery', 
    'underscore', 
    'backbone',
    'mixins/xml2html'
], function($,_,Backbone,XML2HTML) {
    'use strict';
    var SectionView = Backbone.View.extend({
        /* to be defined in the concrete classes
        $el         : { html: function(){} },
        template    : function(){},
        name        : '',
        */
        render: function () {
            var html = this.xml2html(this.model.get('xml'),this.xsl,this.params);
            this.$el.append(html);
            return this;
        }
    });
    _.extend(SectionView.prototype,XML2HTML);
    return SectionView;
});
