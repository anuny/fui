(function(){
	var date = {
		now:function(){
			return (new Date).getTime();
		}
	}

	for(var i in date){
		if(typeof Date.prototype[i] != "function"){
			Date.prototype[i] = object[i];
		}
	}
})();