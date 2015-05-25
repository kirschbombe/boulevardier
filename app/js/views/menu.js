/*global define*/
define('views/menu', [
      'jquery'
    , 'underscore'
    , 'backbone'
    , 'text!partials/menu.html'
    , 'mixins/domwatcher'
    , 'views/article/menu'
], function($,_,Backbone,menuTmpl,DOMWatcher,ArticleMenuView) {
    'use strict';
    var MenuView = Backbone.View.extend({
        template: _.template(menuTmpl),
          id:      'menu'
        , tagName: 'div'
        , issue:   null
        , config:  {}
        , initialize: function(args) {
            this.config = args.config;
            this.issue  = args.issue;
        },
        render: function() {
            var that = this;
            if ($('#' + that.id).children().length !== 0) return;
            var items = this.config.menu;
            // render each item from the config file to a <li>
            // must be done async due to retrieval of partial files
            var promises = [];
             // cache of template strings: url => templ
            var templates = {};
            var collections = {};
            _.each(items, function(item){
                templates[item.partial] = '';
                if (item.type === 'menu') {
                    if ( item.collection === "collections/articles") {
                        collections[item.collection] = that.issue.get('collection');
                    } else {
                        throw new Error("Unhandled collection type requested: " + item.collection);
                    }
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
                            var href    = item.item.href.replace(':i', j);
                            var amv     = new ArticleMenuView({model:model});
                            var result  = amv.render({href: '#' + href});
                            // need an <li> element here
                            if (typeof result === 'string') {
                                subContent += result;
                            } else if (result instanceof Element) {
                                if (result.nodeName === 'BODY') {
                                    subContent += result.innerHTML;
                                } else if (result.nodeName === 'LI') {
                                    subContent += result.outerHTML;
                                } else {
                                    throw new Error('Unsupported document element for submenu: ' + result.toString());
                                }
                            } else {
                                throw new Error('Unsupported result type for submenu: ' + result.toString());
                            }
                        });
                        content += (templates[url])({
                            label: item.label,
                            items: subContent
                        });
                    }
                });
            }).then(function() {
                $('#' + that.id).empty().append(that.template({content: content}));
                // confirm that the menu has loaded
                var $failDef = $.Deferred();
                $failDef.fail(function(){
                    that.render();
                });
                that.watchDOM(500, '#' + that.id, $failDef);
            }).fail(function() {
                throw new Error("Failed to build menu.");
            });
        }
    });
    _.extend(MenuView.prototype,DOMWatcher);
    return MenuView;
});
