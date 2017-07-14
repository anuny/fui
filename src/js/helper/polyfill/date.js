(function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var date = {
		now:function(){
			return (new Date).getTime();
		}
	}

	for(var i in date){
		if(!isFunction(Date.prototype[i])){
			Date.prototype[i] = date[i];
		}
	}
})();