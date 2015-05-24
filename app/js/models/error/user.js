/*global define */
define('models/error/user', [
    'backbone'
], function(Backbone) {
    'use strict';
    var UserErrorModel = Backbone.Model.extend({
        defaults: {
            "msg" : ""
        },
        initialize: function(args) {
            throw new Error(args.message);
        }
    });    
    return UserErrorModel;
});
