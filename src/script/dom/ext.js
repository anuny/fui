!function(fui,util,$){
	var sizzle = fui.require('dom/sizzle');
	$.extend({
		caches   : {},
		find     : sizzle,
		support  : sizzle.support,
		isXML    : sizzle.isXML,
		contains : sizzle.contains,
		getText  : sizzle.getText,
		error: function( msg ) {
			throw new Error( msg );
		},
		nodeName: function( elem, name ) {
			return elem.nodeName && util(elem.nodeName).to('upper') ==  util(name).to('upper');
		},
		parseHTML:function (html, context) {
			if ( !html || typeof html !== "string" ) {
				return null;
			}
			context = context || document;
			var parsed = /^<(\w+)\s*\/?>(?:<\/\1>|)$/.exec( html )

			if ( parsed ) {
				return [ context.createElement( parsed[1] ) ];
			}
			parsed = $.clean( [ html ], context);
			return $.merge( [], parsed );
		},
		grep: function( elems, callback, inv ) {
			var retVal,
				ret = [],
				i = 0,
				length = elems.length;
			inv = !!inv;
			for ( ; i < length; i++ ) {
				retVal = !!callback( elems[ i ], i );
				if ( inv !== retVal ) {
					ret.push( elems[ i ] );
				}
			}

			return ret;
		},
		merge:function (first, second) {
			var i = first.length,
				j = 0;

			if (typeof second.length === "number") {
				for (var l = second.length; j < l; j++) {
					first[i++] = second[j];
				}

			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		}
	});
}(fui,fui.util,fui.dom);
