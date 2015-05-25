/*global define*/
/*
 * This is meant to be extended as an abstract base class for the
 * sections of an article.
 */
define('views/article/menu', [
    'jquery', 
    'underscore', 
    'backbone',
    'mixins/xml2html',
    'text!xsl/article-menu.xsl'
], function($,_,Backbone,XML2HTML,amXsl) {
    'use strict';
    var ArticleMenuView = Backbone.View.extend({
        render: function(params) {
            var that = this;
            var xslDoc = new DOMParser().parseFromString(amXsl,'text/xml');
            // this view is meant to be called only after the corresponding
            // article model has been initialized
            if (this.model.init.state() !== 'resolved') {
                throw "Uninitialized article in ArticleMenuView";
            }
//debugger;
            var menuitem = that.xml2html(that.model.get('xml'), xslDoc, params);
            return menuitem;
        }
    });
    _.extend(ArticleMenuView.prototype,XML2HTML);
    return ArticleMenuView;
});
