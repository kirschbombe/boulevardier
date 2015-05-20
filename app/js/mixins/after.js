/*global define */
/*
 * A concurrency mixin that provides functionality similar to
 * Backbone.Event.listenOnce(), except that the event may
 * have already occurred. The event name must be stored in the 
 * object's attributes by name. Used for coordinating 
 * the fulfillment of a dependency under asynchronous 
 * conditions.
 */
define('mixins/after', [
    'jquery' 
], function($) {
    'use strict';
    var After = {
        // pass back a $.Deferred object that is resolved when the
        // event occurs, which may have already happened; the event
        // has a flag in the attributes{} object; basically, this is
        // for waiting on an init event, which has a corresponding
        // init attribute
        after: function(event) {
            var $def = $.Deferred();
            if (this.get(event)) {
                $def.resolve();
            } else {
                this.on(event, function() {
                    $def.resolve();
                });
            }
            return $def;
        }
    };
    return After;
});
