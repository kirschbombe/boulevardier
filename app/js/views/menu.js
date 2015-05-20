/*global define*/
define('views/menu', [
    'jquery',
    'underscore',
    'backbone',
    'text!partials/menu.html',
    'mixins/domwatcher'
], function($,_,Backbone,menuTmpl,DOMWatcher) {
    'use strict';
    var MenuView = Backbone.View.extend({
        template: _.template(menuTmpl),
        el: '#menu',
        app: null,
        init: null,
        initialize: function(opts) {
            var that = this;
            that.app = opts.app;
            that.init = opts.init;
            that.app.fetch('models/menu', {items:that.app.config.menu}).done(function(menu) {
                that.model = menu;
                that.init.resolve(that);
            });
        },
        render: function() {
            var that = this;
            var items = this.model.get('items');
            // render each item from the config file to a <li>
            // must be done async due to retrieval of partial files
            var promises = [];
             // cache of template strings: url => templ
            var templates = {};
            var collections = {};
            _.each(items, function(item){ 
                templates[item.partial] = '';
                if (item.type === 'menu') {
                    var $colDef = $.Deferred();
                    that.app.fetch(item.collection).done(function(col) {
                        collections[item.collection] = col;
                        $colDef.resolve();
                    });
                    promises.push($colDef.promise());
                }
            });
            _.each(_.keys(templates), function(url) {
                var $def = $.Deferred();
                require(['text!' + url], function(templ) {
                    templates[url] = _.template(templ);
                    $def.resolve();
                });
                promises.push($def.promise());
            });
            // render the menu as a <div>
            var content = '';
            $.when.apply($, promises).done(function() {
                _.forEach(items, function(item,i) {
                    var url = item.partial;
                    if (item.type === 'page' || item.type === 'sep') {
                        content += (templates[url])(item);
                    } else if (item.type === 'menu') {
                        var subContent = '';
                        collections[item.collection].models.forEach(function(model,j) {
                            var href = item.item.href.replace(':i', j);
                            subContent += model.menulabel({href: '#' + href});
                        });
                        content += (templates[url])({
                            label: item.label,
                            items: subContent
                        });
                    }
                });
            }).done(function() {
                that.$el.empty().append(that.template({content: content}));
            }).fail(function() {
                new UserErrorView({
                    model: new UserErrorModel({
                        msg: "Failed to build menu."
                    })
                });
            });
        }
    });
    _.extend(MenuView.prototype,DOMWatcher);
    return MenuView;
});
