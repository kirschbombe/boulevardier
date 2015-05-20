/*global define */
define('mixins/xml2html', [
    'jquery',
    'underscore'
], function($,_) {
    'use strict';
    var XML2HTML = {
        // return HTML or JSON string from XSLT transformation
        xml2html: function(xml,xsl,params,mode) {
            var xslDoc;
            if (typeof xsl === 'string') {
                xslDoc = new DOMParser().parseFromString(xsl,'text/xml');
            } else if (typeof xsl === 'object') {
                xslDoc = xsl;
            } else {
                console.log('Unrecognized doc');
                throw "unrecognized doc";
            }
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslDoc);
            if (typeof params === 'object') {
                _.each(_.keys(params), function(key){
                    xsltProcessor.setParameter(null,key,params[key]);
                });
            }
            var result;
            try {
                var doc = xsltProcessor.transformToDocument(xml);
                if (navigator.userAgent.indexOf('Firefox') != -1) {
                    //<transformiix:result>...</transformiix:result>
                    result = doc.documentElement;
                } else {
                    result = doc.body;
                }
            } catch (e) {
                debugger;
                return '';
            }
            // unfortunately, we have to output html from the stylesheets
            // so text, including json, must be wrapped in a <div>
            if (mode === 'text') {
                // <div></div>
                return result.childNodes[0].textContent;
            } else {
                return result.innerHTML;
            }
        }
    };
    return XML2HTML;
});
