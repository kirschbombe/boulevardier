/*global define */
define('mixins/domwatcher', [
    'jquery' 
], function($) {
    'use strict';
    var DOMWatcher = {
        watchDOM : function(ms,sel,$def) {
            if (!sel) throw "Empty selector in watchDOM()";
            if ($(sel).length === 0) {
                var f = function() {
                    if ($(sel).length > 0) {
                        $(document.body).off('DOMNodeInserted', f);
                        $def.resolve();
                    }
                };
                $(document.body).on('DOMNodeInserted', f);
                window.setTimeout(function() {
                    $(document.body).off('DOMNodeInserted', f);
                    $def.reject();
                }, ms);
            } else {
                $def.resolve();
            }
        }
    };
    return DOMWatcher;
});
