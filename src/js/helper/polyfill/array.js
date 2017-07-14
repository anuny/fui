!function(){
	var isFunction = function(obj){
		return typeof obj === "function";
	};
	var array = {
		forEach:function(callback){
			var len = this.length;
			if(!isFunction(callback)) {
				throw new TypeError();
			};
			var context = arguments[1];
			for(var i = 0; i < len; i++) {
				callback.call(context, this[i], i, this);
			}
			return this;
		},
		map:function(callback){
			if(!isFunction(callback)) {
				throw new TypeError();
			}
			var array = [];
			var context = arguments[1];	
			this.forEach(function(ele,i){
				array[i] = callback.call(context, ele, i, this);
			})
			return array;
		},
		filter:function(callback){
			if(!isFunction(callback)) {
				throw new TypeError();
			};
			var context = arguments[1];
			this.forEach(function(ele,i){
				callback.call(context, ele, i, this) && array.push(ele);
			})
			return array;
		},
		every:function(callback){
			if(!isFunction(callback)) {
				throw new TypeError();
			};
			var context = arguments[1];
			this.forEach(function(ele,i){
				if(callback.call(context, ele, i, this)){
					return false
				};
			})
			return true;
		},
		some:function(callback){
			if(!isFunction(callback)) {
				throw new TypeError();
			};
			var context = arguments[1];
			this.forEach(function(ele,i){
				if(callback.call(context, ele, i, this)){
					return true
				};
			})
			return false;
		},
		find:function(){
			var array = [];
			var val = arguments[0];
			this.forEach(function(ele,i){
				if (typeof(val) == 'function') {
					if (val.test(ele)) {
						array.push(i);
					}
				} else {
					if (ele===val) {
						array.push(i);
					}
				}
			})
			return array;
		},
		indexOf:function(){
			this.forEach(function(ele,i){
				if(ele ==arguments[0]) return i
			})
			return -1
		},
		lastIndexOf:function(searchvalue,fromindex){
			var length = this.length;
			fromindex = fromindex * 1 || length - 1;
			this.forEach(function(ele,i){
				if (i <= fromindex && ele === searchvalue) {
					return i;
				}
			})
			return -1;
		},
		max:function(){
			return Math.max.apply({}, this)
		},
		min:function(){
			return Math.min.apply({}, this)
		},
		isArray:function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		}
	}

  
	for(var i in array){
		if(!isFunction(Array.prototype[i])){
			Array.prototype[i] = array[i];
		}
	}
}();