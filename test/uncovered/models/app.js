/*global define */
define('models/app', [
    'jquery',
    'underscore',
    'backbone',
    'models/error/user',
    'views/error/user',
    'routes/router',
    'views/app'
], function($,_,Backbone,UserErrorModel,UserErrorView,Router,AppView) {
    'use strict';
    var signal = {};
    var AppModel = Backbone.Model.extend({
          config:       {}
        , router:       null
        , singletons:   {}  // $.Deferred object that returns singleton
        , initialize: function(opts) {
            var that = this;
            that.config = opts.config;
            var promises = that._initSingletons();
            _.extend(that, { classname: 'models/app' });
            $.when.apply($, promises).done(function() {
                that.router = new Router({ 
                    app:    that, 
                    routes: that.config.pages.routes 
                });
            });
            var appview = new AppView({model:that});
        }
        , _initSingletons: function() {
            var that = this;
            if (!_.has(this.config, 'persistance')) return;
            // instantiate the singleton classes
            _.pluck(_.where(
                this.config.persistance, 
                { "persist": true, "singleton": true }
            ), 'name').forEach(function(klass) {
                if (that.singletons[klass] !== undefined) {
                    new UserErrorView({
                        model: new UserErrorModel({
                            msg: "Cannot instantiate from '" + klass + "' as non-singleton"
                        })
                    });
                    throw "Multiple instantiation in app.initialize";
                }
                that.singletons[klass] = $.Deferred();
            });
            // async call
            var promises = [];
            _.each(_.keys(that.singletons), function(klass) {
                if (klass.match(/^collection/)) return;
                var $def = that.singletons[klass];
                that._create(klass,$def);
                promises.push($def.promise());
            });
            return promises;
        }
        , _isSingleton: function(klass) {
            return _.has(this.config, 'persistance')
                && _.where(this.config.persistance,
                    {'name': klass, "persist": true, "singleton": true}
                   ).length > 0 
        },
        _create: function(klass,$def,args) {
            var that = this;
            require([klass], function(Constr) {
                var inits = {
                    app: that,
                    init: $def
                };
                var obj;
                // collections must be constructed synchronously by their models
                // to avoid data races on their contents
                if (klass.match(/^collection/)) {
                    throw('Construct collection synchronously');
                } else {
                    var opts = _.extend(inits, args);
                    obj = new Constr(opts);
                }
                obj = _.extend(obj, {
                    classname: klass
                });
            });
        }
        // return promise object for the instantiated object
        , fetch: function(klass,args) {
            var $def;
            if (this._isSingleton(klass)) {
                $def = this.singletons[klass];
            } else {
                $def = $.Deferred();
                this._create(klass,$def,args);
            }
            return $def.promise();
        }
    });
    return AppModel;
});
