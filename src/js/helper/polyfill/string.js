!function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var string = {
		trim:function(){
			return this.replace(/^\s+|\s+$/g,'');
		},
		trimLeft:function(){
			return this.replace(/(^\s*)/g, '');
		},
		trimRight:function(){
			return this.replace(/(\s*$)/g,'');
		},
		trimAll:function(){
			return this.replace(/\s/g,'');
		}
	}

	for(var i in string){
		if(!isFunction(String.prototype[i])){
			String.prototype[i] = string[i];
		}
	}
}();