/*global define */
define('mixins/xml2html', [
    'jquery',
    'underscore'
], function($,_) {
    'use strict';
    var XML2HTML = {
        _doc: function(xml) {
            var xmlDoc;
            if (typeof xml === 'string') {
                xmlDoc = new DOMParser().parseFromString(xml,'text/xml');
            } else if (typeof xml === 'object') {
                xmlDoc = xml;
            } else {
                throw new Error("Unrecognized document input in XML2HTML");
            }
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                throw new Error("Failed to parse document in xml2html");
            }
            return xmlDoc;
        },
        // return HTML or JSON string from XSLT transformation
        xml2html: function(xml,xsl,params,mode) {
            var xmlDoc = this._doc(xml),
                xslDoc = this._doc(xsl);
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslDoc);
            if (typeof params === 'object') {
                _.each(_.keys(params), function(key){
                    xsltProcessor.setParameter(null,key,params[key]);
                });
            }
            var result;
            try {
                var doc = xsltProcessor.transformToDocument(xmlDoc);
                if (navigator.userAgent.indexOf('Firefox') != -1) {
                    //<transformiix:result>...</transformiix:result>
                    result = doc.documentElement;
                } else {
                    result = doc.body;
                }
            } catch (e) {
                throw new Error('Error in XSLT transform: ' + e.toString());
            }
            if (mode === 'text') {
                return result.textContent;
            } else {
                return result;
            }
        }
    };
    return XML2HTML;
});
