/*global define */
define('collections/articles', [
    'jquery', 
    'underscore', 
    'backbone',
    'models/article'
], function($,_,Backbone,ArticleModel) {
    'use strict';
    var ArticlesCollection = Backbone.Collection.extend({
        model: ArticleModel
    });    
    return ArticlesCollection;
});
