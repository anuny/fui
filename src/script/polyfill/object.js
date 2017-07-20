!function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var polyfill = {
		create:function(proto){
			if (arguments.length > 1) {
				throw new Error('Object.create implementation only accepts the first parameter.');
			}
			function F() {}
			F.prototype = proto;
			return new F();
		},
		keys:function(proto){
			if (proto !== Object(proto)) {
				throw new TypeError('Object.keys called on a non-object');
			}
			var ret=[], key;
			for (key in proto) {
				if (Object.prototype.hasOwnProperty.call(proto,key)) {
					ret.push(key);
				}
			}
			return ret;
		},
		is:function(x, y){
			if (x === y) {
			  return x !== 0 || 1 / x === 1 / y;
			} else {
			  return x !== x && y !== y;
			}
		}
	}

	for(var i in polyfill){
		if(!isFunction(Object[i])){
			Object[i] = polyfill[i];
		}
	}
	
}();