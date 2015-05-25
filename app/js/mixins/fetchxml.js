/*global define */
define('mixins/fetchxml', [
    'jquery' 
], function($) {
    'use strict';
    var FetchXML = {
        // return an object implementing the Promise interface
        // when successful, the Promise returns the data fetched
        // by the ajax request
        // data returned by the promise is a Document
        fetchXML : function(url) {
            var $get = $.ajax({
                type:       'GET',
                url:        url,
                dataType:   'xml',
                success: function(data) {
                     return data;
                },
                fail: function(jqXHR, textStatus, errorThrown) {
                    console.log('Failed to fetch XML at url "' + url +'": ' + errorThrown);
                }
            });
            return $get.promise();
        }
    };
    return FetchXML;
});
