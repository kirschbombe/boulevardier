/*global define */
define('mixins/asyncInit', [
    'jquery',
    'underscore'
], function($,_) {
    'use strict';
    var AsyncInit = {
          $def: null
        , init: function() {
            return this.$def.promise();
        }
    };
    return AsyncInit;
});
