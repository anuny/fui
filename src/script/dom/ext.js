(function(fui){
	
	var util = fui.util;
	var $ = fui.dom;
	var sizzle = fui.require('dom/sizzle');
	var msie = util.browser.msie;
	var styleFloat = msie ?"styleFloat" :"cssFloat";
	
	var domready = function (ready) {
	  var fns = [], fn, f = false
		, doc = document
		, testEl = doc.documentElement
		, hack = testEl.doScroll
		, domContentLoaded = 'DOMContentLoaded'
		, addEventListener = 'addEventListener'
		, onreadystatechange = 'onreadystatechange'
		, readyState = 'readyState'
		, loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
		, loaded = loadedRgx.test(doc[readyState])

	  function flush(f) {
		loaded = 1
		while (f = fns.shift()) f()
	  }

	  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
		doc.removeEventListener(domContentLoaded, fn, f)
		flush()
	  }, f)


	  hack && doc.attachEvent(onreadystatechange, fn = function () {
		if (/^c/.test(doc[readyState])) {
		  doc.detachEvent(onreadystatechange, fn)
		  flush()
		}
	  })
	  return (ready = hack ?
		function (fn) {
			
		  self != top ?
			loaded ? fn() : fns.push(fn) :
			function () {
			  try {
				testEl.doScroll('left')
			  } catch (e) {
				return setTimeout(function() { ready(fn) }, 50)
			  }
			  fn()
			}()
		} :
		function (fn) {	
		  loaded ? fn() : fns.push(fn)
		})
	};
	

	var fn = {
		cache:{},
		find:sizzle,
		support:sizzle.support,
		isXML:sizzle.isXML,
		contains:sizzle.contains,
		getText:sizzle.getText,
		error: function( msg ) {
			throw new Error( msg );
		},
		nodeName: function( elem, name ) {
			return elem.nodeName && util(elem.nodeName).to('upper') ==  util(name).to('upper');
		},
		props: {
			cssFloat: styleFloat,
			styleFloat: styleFloat,
		},
		attr: function( elem, name, value ) {
			if (!elem || elem.nodeType == 3 || elem.nodeType == 8){
				return undefined;
			}
				
			var set = value !== undefined;
			name = $.props[ name ] || name;
			if ( elem.tagName ) {
				var special = /href|src|style/.test( name );
				if ( name == "selected" && util.browser.safari )
					elem.parentNode.selectedIndex;
				if ( name in elem && !special ) {
					if ( set ){
						if ( name == "type" && $.nodeName( elem, "input" ) && elem.parentNode )
							$.error("type property can't be changed");
						elem[ name ] = value;
					}
					if( $.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
						return elem.getAttributeNode( name ).nodeValue;
					return elem[ name ];
				}
				if ( msie &&  name == "style" )
					return $.attr( elem.style, "cssText", value );
				if ( set )
					elem.setAttribute( name, "" + value );
				var attr = msie && special? elem.getAttribute( name, 2 ): elem.getAttribute( name );
				return attr === null ? undefined : attr;
			}
			if ( msie && name == "opacity" ) {
				if ( set ) {	
					elem.zoom = 1;
					elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
						(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
				}
				return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
					(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
					"";
			}
			name = name.replace(/-([a-z])/ig, function(all, letter){
				return letter.toUpperCase();
			});
			if ( set )
				elem[ name ] = value;
			return elem[ name ];
		},
		ready:function(callback){
			var ready = domready();
			ready(callback);
		}
	};
	fui.extend($,fn);
})(fui);
