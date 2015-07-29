define('utils',[], function() {
'use strict';
return {
  // return true of two lists of attributes are the same,
  // where sameness means 
  diffAtts: function(as,bs) {
      if (as.length !== bs.length) return false;
      if (as.length === 0) return true;
      for (var i = 0; i < as.length; ++i) {
          for (var j = 0; j < bs.length; ++j) {
              if (as[i].name === bs[j].name) {
                  if (as[i].value !== bs[j].value) {
                      return false;
                  } 
              }
          }
      }
      return true;
  }
  // return true if two DOM nodes are equal; for elt nodes, 
  // equality means same node name, attributes, and child elements;
  // for text nodes, equality means equal string values
  , diff: function(a,b) {
      if (a.nodeType !== b.nodeType) {
        console.log('node types differ: ' + a.nodeType + '  ' + b.nodeType);
        return false;
      }
      if (a.nodeType === Node.ELEMENT_NODE) {
        if (a.nodeName !== b.nodeName) {
            console.log('node names differ: ' + a.nodeName + '  ' + b.nodeName);
            return false;
        }
        if (a.childNodes.length !== b.childNodes.length) return false;
        if (a.attributes.length !== b.attributes.length) return false;
        if (!this.diffAtts(a.attributes,b.attributes))   return false;
        for (var i = 0; i < a.childNodes.length; ++i) {
            if (!this.diff(a.childNodes[i],b.childNodes[i])) {
                return false;
            }
        }          
      } else if (a.nodeType === Node.TEXT_NODE) {
          if (a.textContent !== b.textContent) {
            return false;
          }
      } else if (a.nodeType == Node.COMMENT_NODE) {
         // noop
      } else {
          throw new Error('Unhandled node type: ' + a.nodeType);
      }
      return true;
    }
}
});
