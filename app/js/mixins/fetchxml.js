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
            var $get = $.Deferred();
            $.ajax({
                type:     'GET',
                url:      url,
                dataType: 'xml',
                success: function(data) {
                     $get.resolve(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $get.reject();
                }
            });
            return $get.promise();
        }
    };
    return FetchXML;
});
