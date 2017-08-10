!function(win){
	'use strict';
	var modules = {},
	doc = win.document,
	types = [
		'Array','Boolean','Date','Error','Function','Number',
		'undefined','null','Object','RegExp','String'
	],
	typeIs = function(){
		var obj = arguments[0],
		tostring = Object.prototype.toString,
		regexp = /\[object\s|\]/g;
		return tostring.call(obj).replace(regexp, '');
	},
	util = function(selector) {
		return new util.fn.init(selector);
	};
	util.fn = util.prototype = {	
		constructor: util,
		init:function(selector) {
			this.selector = selector;
			this.type = typeIs(this.selector);
			var This = this;
			types.forEach(function(type){
				This['is' + type] = type === This.type;
			});
		}
	};
	util.fn.init.prototype = util.fn;
	
	var require = function(name,callback){
		if(util(name).isFunction) {
			return name();
		}
		if(!util(name).isArray){
			name = [name]
		}

		var exports=[];
		for(var i=0,len=name.length;i<len;i++){
			var exp = getExp(name[i])
			exports.push(exp)
		}
		if(util(callback).isFunction){
			callback.apply(null,exports)
		}else{
			return exports[0]
		}
	},
	
	getExp = function (name) {
		var mod = modules[name];
		if(!mod){
			return name + ' is not define';
		}
		if(util(mod.factory).isFunction){
			if(mod.factory(mod)){
				return mod.factory(mod)
			}
			return mod.exports
		}else{
			return mod.factory
		}
	},
	
	define = function(name,factory){
		if(!name||!util(name).isString) {
			return  name + ' is not string';
		}
		modules[name]={
			name:name,
			factory:factory,
			exports:{}
		}
	},

	extend = function(){
		var  options, copy, clone, name, src,
		i = 0, target = this, deep = false, length = arguments.length;

		if(util(arguments[0]).isBoolean){
			deep = true;
			i = 1;
			if(length > 2){
				i = 2;
				target = arguments[1];
			}
		}else{
			if(length > 1){
				i = 1;
				target = arguments[0];
			}
		}
		
		for (; i < length; i++) {
			options = arguments[i];
			for (name in options) {
				src = target[name];
				copy = options[name];
				if (copy === target) {
					continue;
				}
				if(deep && copy && 'object' == typeof copy){
					if(util(copy).isArray){
						clone = []
					}else{
						clone = {}
					};
					target[name] = extend(deep, src || clone, copy)
				}else{
					target[name] = copy
				}
			}
		}
		return target;
	},
	fui = function(selector,callback) {
		return new fui.fn.init(selector,callback);
	};
	fui.fn = fui.prototype = {	
		constructor: fui,
		init:function(selector,callback) {
			if(util(selector).isFunction){
				fui.on('ready',selector);
			}else if(selector.nodeType){
				fui.parse(selector,callback);
			}
		}
	};
	fui.extend = fui.fn.extend = extend;
	fui.fn.init.prototype = fui.fn;
	fui.extend({
		define:define,
		require:require,
		window:win,
		document:doc,
		util:util,
		dom:$||jQuery
	});
	win.fui = fui;
}(this);