!function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var polyfill = {
		now:function(){
			return (new Date).getTime();
		}
	}

	for(var i in polyfill){
		if(!isFunction(Date.prototype[i])){
			Date.prototype[i] = polyfill[i];
		}
	}
}();