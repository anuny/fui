!function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var functions = {
		bind:function(oThis){
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}
			var aArgs = Array.prototype.slice.call(arguments, 1), 
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis?this: oThis || window,aArgs.concat(Array.prototype.slice.call(arguments)));
				};
			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();
			return fBound;
		}
	}

	for(var i in functions){
		if(!isFunction(Function.prototype[i])){
			Function.prototype[i] = functions[i];
		}
	}
}();