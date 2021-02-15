/*
 * Read/Write x-path of an element
 * Its used for keep a bound between the clicked element and hotspot visual clue
 *
 * based on : https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
 */

export function getElementByXPath(path) { 
            return (new XPathEvaluator()) 
                .evaluate(path, document.documentElement, null, 
                                XPathResult.FIRST_ORDERED_NODE_TYPE, null) 
                .singleNodeValue; 
        }

export function getXPathForElement(element) {
          const idx = (sib, name) => sib 
              ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
              : 1;
          const segs = elm => !elm || elm.nodeType !== 1 
              ? ['']
              : elm.id && document.getElementById(elm.id) === elm
                  ? [`id("${elm.id}")`]
                  : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
          return segs(element).join('/');
        }
