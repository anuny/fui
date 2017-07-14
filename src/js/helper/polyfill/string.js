!function(){
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
		if(typeof String.prototype[i] != "function"){
			String.prototype[i] = string[i];
		}
	}
}();