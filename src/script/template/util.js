fui.define('template/util',function( module ){
	
	var exports = {};
	
	exports.each = function(array, fn) {
		for (var i = 0, len = array.length; i < len; i++) {
			fn(array[i], i);
		}
	}

	exports.toArray = function(listLike) {
		if (!listLike) {
			return [];
		}
		var list = [];
		for (var i = 0, len = listLike.length; i < len; i++) {
			list.push(listLike[i]);
		}
		return list;
	}

	exports.setAttr = function(node, key, value) {
		switch (key) {
			case 'style':
				node.style.cssText = value;
				break;
			case 'value':
				var tagName = node.tagName || '';
				tagName = tagName.toLowerCase();
				if (tagName === 'input' || tagName === 'textarea') {
					node.value = value;
				} else {
					node.setAttribute(key, value);
				}
				break;
			default:
				node.setAttribute(key, value);
				break;
		}
	}
	exports.clone  = function (obj) {  
		var newObj = {};  
		if (Array == obj.constructor) {  
			newObj = [];  
		}  
		for (var key in obj) {  
			var val = obj[key];  
			newObj[key] = typeof val === 'object' ? exports.clone(val): val;  
		}  
		return newObj;  
	};
	exports.extend = function (dest, src) {
	  for (var key in src) {
		if (src.hasOwnProperty(key)) {
		  dest[key] = src[key]
		}
	  }
	  return dest
	};
	var nextTick = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame

	if (nextTick) {
		exports.nextTick = function () {
			nextTick.apply(window, arguments)
		}
	} else {
		exports.nextTick = function (func) {
			setTimeout(func)
		}
	};

	module.exports = exports;
});
