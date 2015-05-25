/*global define */
define('models/article', [
    'jquery', 
    'underscore', 
    'backbone',
    'views/article',
    'mixins/fetchxml',
    'views/article/menu'
], function($,_,Backbone,ArticleView,FetchXML,ArticleMenuView) {
    'use strict';
    var ArticleModel = Backbone.Model.extend({
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            var $get = this.fetchXML(that, that.get('path'));
            $.when($get).done(function(data) {
                that.set('xml', data);
                that.init.resolve(that);
            }).fail(function(jqXHR, textStatus, errorThrown){
                console.log("Failed to retrieve article (" + that.get('id') + "), : " + errorThrown);
                that.init.fail();
            });
        },
        defaults: {
            //TODO: 'xml': serialize? and cache to localstorage
            // add adapter for access through .attributes
            "xml"   : null,     // Document
            "init"  : false,
            "marker" : null
        },
        select: function() {
            var av = new ArticleView({model: this});
            this.trigger('active');
        },
        unselect: function() {
            this.trigger('inactive');
        },
        menulabel: function(params) {
            var amv = new ArticleMenuView({model:this});
            return amv.render(params);
        }
    });
    _.extend(ArticleModel.prototype,FetchXML);
    return ArticleModel;
});
