!function(win){
	'use strict';
	
	var modules = {},
	
	doc = win.document,
	
	typeOf = function(obj){
		return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
	},
	type = (function(){
		var ret = {};
		['Function','Array','Object','String','Boolean','Number','RegExp'].forEach(function(e){
			ret['is'+e] = function(){
				return e === typeOf(arguments[0])
			}
		});
		return ret;
	})(),
	require = function(name,callback){
		if(type.isFunction(name)) {
			return name();
		}
		if(!type.isArray(name)){
			name = [name]
		}

		var exports=[];
		for(var i=0,len=name.length;i<len;i++){
			var exp = getExp(name[i])
			exports.push(exp)
		}
		if(type.isFunction(callback)){
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
		if(type.isFunction(mod.factory)){
			if(mod.factory(mod)){
				return mod.factory(mod)
			}
			return mod.exports
		}else{
			return mod.factory
		}
	},
	
	define = function(name,factory){
		if(!name||!type.isString(name)) {
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

		if(type.isBoolean(arguments[0])){
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
					if(type.isArray(copy)){
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
	util = extend({typeOf:typeOf},type),
	fui = function(selector,callback) {
		return new fui.fn.init(selector,callback);
	};
	fui.fn = fui.prototype = {	
		constructor: fui,
		init:function(selector,callback) {
			if(type.isFunction(selector)){
				fui.on('ready',selector);
			}else if(selector.nodeType){
				fui.parse(selector,callback);
			}
		}
	};
	fui.fn.init.prototype = fui.fn;
	fui.extend = fui.fn.extend = extend;
	fui.extend({
		define:define,
		require:require,
		window:win,
		document:doc,
		util:util
	});
	win.fui = fui;
}(this);