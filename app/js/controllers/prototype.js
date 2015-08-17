/*global define*/
define('controllers/prototype', [
      'underscore'
    , 'backbone'
], function(_,Backbone) {
    'use strict';
    var Controller = function() {
        this.cid = _.uniqueId('controller');
        this.initialize.apply(this, arguments);
    };
    Controller.extend = Backbone.Router.extend;
    _.extend(Controller.prototype, Backbone.Events);
    _.extend(Controller.prototype, { 
        initialize: function() {
            throw new Error('unimplemented initialize()');
        } 
    });
    return Controller;
});