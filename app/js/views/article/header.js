/*global define*/
define('views/article/header', [
    'jquery', 
    'underscore', 
    'backbone', 
    'views/article/section', 
    'text!xsl/header.xsl'
], function($,_,Backbone,SectionView,xsl) {
    'use strict';
    var HeaderView = SectionView.extend({
        el     : '#header',
        $el    : $('#header'),
        xsl    : xsl,
        name   : 'header' 
    });
    return HeaderView;
});
